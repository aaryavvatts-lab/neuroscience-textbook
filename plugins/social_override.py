"""MkDocs hook that overrides og:image and twitter:image with a page's
`image:` frontmatter value.

Behavior:
    - If the page has `image:` in its frontmatter, og:image and
      twitter:image are set to site_url + image (absolute URL), and an
      existing og:image:type is corrected to match the image's extension.
    - If the page has no `image:`, img/cover.png is used as the default.
    - og:title, og:description, og:type, og:url, og:site_name and the
      twitter:card/title/description tags are added when missing (this
      book does not use the imaging-based social plugin).

Adapted from Dan McCreary's init-textbook asset (ibook-skills). When the mkdocs-material[imaging] social plugin is enabled, its
auto-generated /assets/images/social/<page>.png card is what crawlers see
for every page that does NOT declare `image:`. A page that DOES declare
`image:` always wins over the generated card.

Loaded via the `hooks:` entry in mkdocs.yml, not as a plugin -- this
avoids collisions with other projects that also install a package
called `social_override` or a top-level module called `plugins`.
"""

import re


def _add_text_tags(html, page, config):
    """Add og/twitter title, description, type, url and card tags when missing.

    Added for this book: without the social plugin, Material emits no
    og:title or og:description, so shared links had no title or summary.
    """
    from html import escape
    meta = page.meta or {}
    title = meta.get("title") or page.title or config.get("site_name", "")
    if page.is_homepage:
        title = config.get("site_name", title)
    description = meta.get("description") or config.get("site_description", "")
    site_url = (config.get("site_url") or "").rstrip("/") + "/"
    page_url = site_url + (page.url or "")
    tags = [
        ("property", "og:title", title),
        ("property", "og:description", description),
        ("property", "og:type", "website"),
        ("property", "og:url", page_url),
        ("property", "og:site_name", config.get("site_name", "")),
        ("name", "twitter:card", "summary_large_image"),
        ("name", "twitter:title", title),
        ("name", "twitter:description", description),
    ]
    add = []
    for attr, key, value in tags:
        if value and not re.search(r'<meta\s+(?:property|name)="' + re.escape(key) + '"', html):
            add.append(f'<meta {attr}="{key}" content="{escape(str(value), quote=True)}">')
    if add:
        html = html.replace("</head>", "  " + "\n  ".join(add) + "\n</head>", 1)
    return html


def on_post_page(html, page, config, **kwargs):
    html = _add_text_tags(html, page, config)
    image = (page.meta or {}).get("image")
    if not image:
        image = "img/cover.png"

    site_url = config.get("site_url") or ""
    if not site_url:
        return html

    if image.startswith(("http://", "https://")):
        image_url = image
    else:
        image_url = site_url.rstrip("/") + "/" + image.lstrip("/")

    og_tag = f'<meta property="og:image" content="{image_url}">'
    og_pattern = re.compile(
        r'<meta\s+property="og:image"\s+content="[^"]*"[^>]*>'
    )
    if og_pattern.search(html):
        html = og_pattern.sub(og_tag, html, count=1)
    else:
        html = html.replace("</head>", f"  {og_tag}\n</head>", 1)

    tw_tag = f'<meta name="twitter:image" content="{image_url}">'
    tw_pattern = re.compile(
        r'<meta\s+(?:property|name)="twitter:image"\s+content="[^"]*"[^>]*>'
    )
    if tw_pattern.search(html):
        html = tw_pattern.sub(tw_tag, html, count=1)
    else:
        html = html.replace("</head>", f"  {tw_tag}\n</head>", 1)

    # The social plugin's generated cards are PNGs, so it always emits
    # og:image:type image/png. Make the type match this page's image
    # instead -- a .jpg cover would otherwise be announced as a PNG.
    # (Only an existing tag is changed; none is added.)
    image_types = {".png": "image/png", ".jpg": "image/jpeg",
                   ".jpeg": "image/jpeg", ".gif": "image/gif",
                   ".webp": "image/webp"}
    extension = "." + image_url.split("?", 1)[0].rsplit(".", 1)[-1].lower()
    if extension in image_types:
        html = re.sub(r'<meta\s+property="og:image:type"[^>]*>',
                      f'<meta property="og:image:type" '
                      f'content="{image_types[extension]}">', html)

    return html
