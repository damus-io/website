document.getElementById("createButton").addEventListener("click", function() {
      let key = document.getElementById("keyInput").value;
      let name = document.getElementById("nameInput").value;
      let json = {
        "names": {
          [name]: key
        }
      };
      let jsonStr = JSON.stringify(json);
      let blob = new Blob([jsonStr], { type: "application/json" });
      let htaccess = `<IfModule mod_headers.c>
   Header set Access-Control-Allow-Origin "*"
 </IfModule>`;
      let zip = new JSZip();
      zip.folder(".well-known").file("nostr.json", blob);
      zip.file(".htaccess", htaccess);
      zip.generateAsync({ type: "blob" }).then(function(content) {
        saveAs(content, "nip05.zip");
      });
    });