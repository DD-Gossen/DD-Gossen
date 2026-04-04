#!/usr/bin/env python3
"""Move EN service landing to /en/, EN hub to /shopify-freelancer/en/."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def build_en_service(old_service: str) -> str:
    t = old_service.replace("../../", "../")
    t = t.replace("https://dd-gossen.com/shopify-freelancer/en/", "https://dd-gossen.com/en/")
    t = t.replace("https://dd-gossen.com/shopify-freelancer/en#", "https://dd-gossen.com/en#")
    t = t.replace("https://dd-gossen.com/shopify-freelancer/en'", "https://dd-gossen.com/en'")
    t = t.replace('https://dd-gossen.com/shopify-freelancer/en"', 'https://dd-gossen.com/en"')
    t = t.replace(
        '<li><a href="https://dd-gossen.com/en/">Home</a></li>',
        '<li><a href="https://dd-gossen.com/shopify-freelancer/en/">Home</a></li>',
    )
    return t


def build_en_hub(old_hub: str) -> str:
    """Old content lived at /en/; new URL is /shopify-freelancer/en/."""
    t = old_hub
    t = t.replace('href="../', 'href="../../')
    t = t.replace('src="../', 'src="../../')
    hub = "https://dd-gossen.com/shopify-freelancer/en/"
    svc = "https://dd-gossen.com/en/"
    subs = [
        ("https://dd-gossen.com/en/shopify-withdrawal-button-service/", "___TOK_WD___"),
        ("https://dd-gossen.com/en/legal-notice.html", "___TOK_LEGAL___"),
        ("https://dd-gossen.com/en/privacy-policy.html", "___TOK_PRIV___"),
        ("https://dd-gossen.com/en/terms.html", "___TOK_TERMS___"),
    ]
    for a, b in subs:
        t = t.replace(a, b)
    t = t.replace("https://dd-gossen.com/en/#", "___TOK_ENHASH___")
    t = t.replace("https://dd-gossen.com/en/", hub)
    t = t.replace("___TOK_ENHASH___", "https://dd-gossen.com/en/#")
    for a, b in subs:
        t = t.replace(b, a)
    t = t.replace(
        f"onclick=\"window.location.href='{hub}'\"",
        f"onclick=\"window.location.href='{svc}'\"",
    )
    t = t.replace(
        f'<a href="{hub}" class="btn-card-cta" style="background: rgba(255,255,255,0.15); '
        'border: 1px solid rgba(255,255,255,0.4); color: white; margin-top: 0.5rem;">View all services →</a>',
        f'<a href="{svc}" class="btn-card-cta" style="background: rgba(255,255,255,0.15); '
        'border: 1px solid rgba(255,255,255,0.4); color: white; margin-top: 0.5rem;">View all services →</a>',
    )
    t = t.replace(
        f'<li><a href="{hub}">My Services</a></li>',
        f'<li><a href="{svc}">My Services</a></li>',
    )
    t = t.replace(
        f'<li><a href="{hub}">Shop Setup & Optimization</a></li>',
        f'<li><a href="{svc}">Shop Setup & Optimization</a></li>',
    )
    t = t.replace(
        '<link rel="alternate" hreflang="en" href="https://dd-gossen.com/en/">',
        f'<link rel="alternate" hreflang="en" href="{hub}">',
    )
    t = t.replace(
        '"url": "https://dd-gossen.com/en/"',
        f'"url": "{hub}"',
        1,
    )
    t = t.replace(
        f'"name": "DD-Gossen",\n        "url": "{hub}"',
        '"name": "DD-Gossen",\n        "url": "https://dd-gossen.com/"',
        1,
    )
    return t


def sitewide(path: Path, text: str) -> str:
    rel = str(path.relative_to(ROOT))
    if rel in ("en/index.html", "shopify-freelancer/en/index.html"):
        return text
    t = text.replace("https://dd-gossen.com/shopify-freelancer/en/", "https://dd-gossen.com/en/")
    t = t.replace("https://dd-gossen.com/shopify-freelancer/en#", "https://dd-gossen.com/en#")
    t = t.replace("https://dd-gossen.com/shopify-freelancer/en'", "https://dd-gossen.com/en'")
    t = t.replace('https://dd-gossen.com/shopify-freelancer/en"', 'https://dd-gossen.com/en"')
    t = t.replace(
        '<li><a href="https://dd-gossen.com/en/">Home</a></li>',
        '<li><a href="https://dd-gossen.com/shopify-freelancer/en/">Home</a></li>',
    )
    t = t.replace(
        'href="https://dd-gossen.com/en/" class="logo"',
        'href="https://dd-gossen.com/shopify-freelancer/en/" class="logo"',
    )
    return t


def main():
    en_f = ROOT / "en/index.html"
    sf_en_f = ROOT / "shopify-freelancer/en/index.html"
    old_hub = en_f.read_text(encoding="utf-8")
    old_svc = sf_en_f.read_text(encoding="utf-8")
    en_f.write_text(build_en_service(old_svc), encoding="utf-8")
    sf_en_f.write_text(build_en_hub(old_hub), encoding="utf-8")

    for path in ROOT.rglob("*.html"):
        if "node_modules" in path.parts:
            continue
        rel = str(path.relative_to(ROOT))
        if rel in ("en/index.html", "shopify-freelancer/en/index.html"):
            continue
        raw = path.read_text(encoding="utf-8")
        new = sitewide(path, raw)
        if new != raw:
            path.write_text(new, encoding="utf-8")
            print("updated", rel)


if __name__ == "__main__":
    main()
