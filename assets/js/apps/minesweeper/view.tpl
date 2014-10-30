 <h1>Sweeper</h1>
    <p>clear the field of x's</p>
    <div id="sweeper-menu">
      <li onclick="b.rebuild();">Rebuild</li>
      <li onclick="b.cheat();">Cheat</li>
      <li onclick="b.resize();">Resize</li>
      <li onclick="b.submit();">Submit</li>
    </div>
    <div id="resize" style="display: none;">
      Sweeping Area : <input id="size" type="number" min="1" max="32" value="8"></input>
      X's : <input id="mines" type="number" min="1" max="64" value="10"></input>
    </div>
    <table id="grid"></table>
    <span id="result"></span>
    <div>You have flagged <span id="flags">0</span> cells.</div>