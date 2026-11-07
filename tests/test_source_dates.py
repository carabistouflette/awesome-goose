import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


class SourceDates(unittest.TestCase):
    def check_inventory(self, reviewed, latest='2026-11-07'):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root/'scripts').mkdir()
            (root/'docs').mkdir()
            shutil.copyfile(ROOT/'scripts/check.py', root/'scripts/check.py')
            (root/'README.md').write_text('- [example/lib](https://github.com/example/lib) — Example.\n')
            record = {'repository': 'example/lib', 'commit': 'a'*40,
                      'readme': f'https://github.com/example/lib/blob/{"a"*40}/README.md',
                      'reviewed': reviewed}
            (root/'docs/sources.json').write_text(json.dumps({'review_date': latest, 'repositories': [record]}))
            return subprocess.run([sys.executable, root/'scripts/check.py'], capture_output=True, text=True)

    def test_older_and_current_record_dates_are_accepted(self):
        for reviewed in ('2026-11-06', '2026-11-07'):
            self.assertEqual(self.check_inventory(reviewed).returncode, 0)

    def test_future_and_invalid_dates_are_rejected(self):
        for reviewed in ('2026-11-08', '2026-11-31', '20261106', None):
            self.assertNotEqual(self.check_inventory(reviewed).returncode, 0)

    def test_invalid_inventory_date_is_rejected(self):
        result = self.check_inventory('2026-11-06', latest='yesterday')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Invalid inventory review date', result.stderr)


if __name__ == '__main__':
    unittest.main()
