"""Génère lecture/index.html (version consultation) à partir de index.html.
À relancer après chaque modification de index.html."""
import pathlib
root = pathlib.Path(__file__).resolve().parent.parent
s = (root / "index.html").read_text(encoding="utf-8")
s = s.replace('href="icon.png"', 'href="../icon.png"')
s = s.replace('register("sw.js")', 'register("../sw.js", { scope: "../" })')
s = s.replace("<title>Carmen Prépa tech 2027</title>", "<title>Carmen Prépa tech 2027 · consultation</title>", 1)
first = s.index("<script>")
s = s[:first] + "<script>window.CARMEN_LECTURE = true;</script>\n" + s[first:]
(root / "lecture").mkdir(exist_ok=True)
(root / "lecture" / "index.html").write_text(s, encoding="utf-8")
print("lecture/index.html à jour")
