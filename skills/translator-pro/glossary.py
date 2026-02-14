#!/usr/bin/env python3
"""
Glossary Manager for Translator Pro v1.0.0
Manages domain-specific glossaries for translation term mapping.
Author: Peru 🇵🇪

Glossaries are stored as JSON in .glossaries/ subdirectory.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime

VERSION = "1.0.0"
SCRIPT_DIR = Path(__file__).parent.resolve()
GLOSSARY_DIR = SCRIPT_DIR / ".glossaries"


def ensure_glossary_dir():
    """Create glossary directory if it doesn't exist."""
    GLOSSARY_DIR.mkdir(parents=True, exist_ok=True)


def get_glossary_path(domain: str) -> Path:
    """Get path to a glossary file."""
    return GLOSSARY_DIR / f"{domain}.json"


def load_glossary(domain: str) -> dict:
    """Load a glossary from file, or create empty one."""
    path = get_glossary_path(domain)
    if path.exists():
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "domain": domain,
        "created": datetime.utcnow().isoformat(),
        "updated": datetime.utcnow().isoformat(),
        "entries": []
    }


def save_glossary(domain: str, glossary: dict):
    """Save a glossary to file."""
    ensure_glossary_dir()
    glossary["updated"] = datetime.utcnow().isoformat()
    path = get_glossary_path(domain)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(glossary, f, indent=2, ensure_ascii=False)
    print(f"✓ Glossary '{domain}' saved to {path}")


def cmd_add(args):
    """Add a term to a glossary."""
    glossary = load_glossary(args.domain)

    # Check for duplicate
    for entry in glossary["entries"]:
        if (entry["source"].lower() == args.source.lower() and
                entry["from_lang"] == args.from_lang and
                entry["to_lang"] == args.to_lang):
            # Update existing
            entry["target"] = args.target
            entry["updated"] = datetime.utcnow().isoformat()
            save_glossary(args.domain, glossary)
            print(f"📝 Updated: '{args.source}' ({args.from_lang}) → '{args.target}' ({args.to_lang})")
            return

    # Add new entry
    entry = {
        "source": args.source,
        "target": args.target,
        "from_lang": args.from_lang,
        "to_lang": args.to_lang,
        "added": datetime.utcnow().isoformat()
    }
    glossary["entries"].append(entry)
    save_glossary(args.domain, glossary)
    print(f"✅ Added: '{args.source}' ({args.from_lang}) → '{args.target}' ({args.to_lang})")


def cmd_remove(args):
    """Remove a term from a glossary."""
    glossary = load_glossary(args.domain)
    original_count = len(glossary["entries"])

    glossary["entries"] = [
        e for e in glossary["entries"]
        if not (e["source"].lower() == args.source.lower() and
                e["from_lang"] == args.from_lang and
                e["to_lang"] == args.to_lang)
    ]

    if len(glossary["entries"]) < original_count:
        save_glossary(args.domain, glossary)
        print(f"🗑️  Removed: '{args.source}' ({args.from_lang} → {args.to_lang})")
    else:
        print(f"⚠️  Entry not found: '{args.source}' ({args.from_lang} → {args.to_lang})")


def cmd_list(args):
    """List entries in a glossary."""
    if args.domain:
        # List entries in a specific glossary
        glossary = load_glossary(args.domain)
        entries = glossary.get("entries", [])

        if not entries:
            print(f"📚 Glossary '{args.domain}' is empty.")
            return

        print(f"\n📚 Glossary: {args.domain}")
        print(f"   Created: {glossary.get('created', 'unknown')}")
        print(f"   Updated: {glossary.get('updated', 'unknown')}")
        print(f"   Entries: {len(entries)}")
        print("─" * 60)
        print(f"  {'Source':<25} {'From':<6} {'Target':<25} {'To':<6}")
        print("─" * 60)

        for entry in entries:
            print(f"  {entry['source']:<25} {entry['from_lang']:<6} {entry['target']:<25} {entry['to_lang']:<6}")

        print("─" * 60)
    else:
        # List all available glossaries
        ensure_glossary_dir()
        glossaries = list(GLOSSARY_DIR.glob("*.json"))

        if not glossaries:
            print("📚 No glossaries found. Create one with: glossary.py add --domain <name> ...")
            return

        print("\n📚 Available Glossaries")
        print("─" * 50)

        for gpath in sorted(glossaries):
            with open(gpath, 'r', encoding='utf-8') as f:
                g = json.load(f)
            domain = gpath.stem
            count = len(g.get("entries", []))
            updated = g.get("updated", "unknown")
            print(f"  {domain:<20} {count:>4} entries   (updated: {updated[:10]})")

        print("─" * 50)


def cmd_export(args):
    """Export a glossary to a JSON file."""
    glossary = load_glossary(args.domain)
    output = args.output or f"{args.domain}_glossary.json"

    with open(output, 'w', encoding='utf-8') as f:
        json.dump(glossary, f, indent=2, ensure_ascii=False)

    count = len(glossary.get("entries", []))
    print(f"📤 Exported glossary '{args.domain}' ({count} entries) to {output}")


def cmd_import(args):
    """Import a glossary from a JSON file."""
    if not os.path.exists(args.file):
        print(f"✗ File not found: {args.file}", file=sys.stderr)
        sys.exit(1)

    with open(args.file, 'r', encoding='utf-8') as f:
        imported = json.load(f)

    domain = imported.get("domain", Path(args.file).stem.replace("_glossary", ""))

    # Merge with existing or create new
    existing = load_glossary(domain)
    existing_keys = {
        (e["source"].lower(), e["from_lang"], e["to_lang"])
        for e in existing["entries"]
    }

    added = 0
    for entry in imported.get("entries", []):
        key = (entry["source"].lower(), entry["from_lang"], entry["to_lang"])
        if key not in existing_keys:
            existing["entries"].append(entry)
            existing_keys.add(key)
            added += 1

    save_glossary(domain, existing)
    print(f"📥 Imported {added} new entries into glossary '{domain}' "
          f"(total: {len(existing['entries'])})")


def cmd_clear(args):
    """Clear all entries from a glossary."""
    glossary = load_glossary(args.domain)
    count = len(glossary.get("entries", []))
    glossary["entries"] = []
    save_glossary(args.domain, glossary)
    print(f"🗑️  Cleared {count} entries from glossary '{args.domain}'")


def main():
    parser = argparse.ArgumentParser(
        description="📚 Glossary Manager for Translator Pro",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s add --domain tech --from en --to es "API" "API"
  %(prog)s add --domain tech --from en --to es "machine learning" "aprendizaje automático"
  %(prog)s list --domain tech
  %(prog)s list                          # list all glossaries
  %(prog)s export --domain tech --output tech_glossary.json
  %(prog)s import --file tech_glossary.json
  %(prog)s remove --domain tech --from en --to es "API"
  %(prog)s clear --domain tech
        """
    )

    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # Add command
    add_parser = subparsers.add_parser("add", help="Add a term to a glossary")
    add_parser.add_argument("--domain", required=True, help="Glossary domain name")
    add_parser.add_argument("--from", dest="from_lang", required=True, help="Source language code")
    add_parser.add_argument("--to", dest="to_lang", required=True, help="Target language code")
    add_parser.add_argument("source", help="Source term")
    add_parser.add_argument("target", help="Target term (translation)")

    # Remove command
    rm_parser = subparsers.add_parser("remove", help="Remove a term from a glossary")
    rm_parser.add_argument("--domain", required=True, help="Glossary domain name")
    rm_parser.add_argument("--from", dest="from_lang", required=True, help="Source language code")
    rm_parser.add_argument("--to", dest="to_lang", required=True, help="Target language code")
    rm_parser.add_argument("source", help="Source term to remove")

    # List command
    list_parser = subparsers.add_parser("list", help="List glossary entries")
    list_parser.add_argument("--domain", default=None, help="Glossary domain (omit to list all)")

    # Export command
    export_parser = subparsers.add_parser("export", help="Export glossary to JSON file")
    export_parser.add_argument("--domain", required=True, help="Glossary domain name")
    export_parser.add_argument("--output", help="Output file path")

    # Import command
    import_parser = subparsers.add_parser("import", help="Import glossary from JSON file")
    import_parser.add_argument("--file", required=True, help="JSON file to import")

    # Clear command
    clear_parser = subparsers.add_parser("clear", help="Clear all entries from a glossary")
    clear_parser.add_argument("--domain", required=True, help="Glossary domain name")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    commands = {
        "add": cmd_add,
        "remove": cmd_remove,
        "list": cmd_list,
        "export": cmd_export,
        "import": cmd_import,
        "clear": cmd_clear,
    }

    commands[args.command](args)


if __name__ == "__main__":
    main()
