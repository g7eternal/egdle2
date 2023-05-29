<p>
  This is a logic puzzle involving placement of differently colored eggs (red and blue by default) on a grid. The
  objective is to fill the grid as quickly as possible.
</p>

<hr />
<img src="example/binary.webp" alt="Example - Binary" class="main" />
<hr />

<p>While the base objective may seem straightforward, there are some rules to follow:</p>
<ul>
  <li>
    No more than two adjacent cells can contain same-colored eggs.
    <div class="mad-example">
      <div class="madeg">
        <img src="emotes/madeg.webp" alt="Madeg" />
      </div>
      <img src="example/binary-triple.webp" alt="Example: Rule 2" />
    </div>
  </li>
  <li>
    Each row and column must contain an equal number of different colored eggs.
    <div class="mad-example">
      <div class="madeg">
        <img src="emotes/madeg.webp" alt="Madeg" />
      </div>
      <img src="example/binary-equal.webp" alt="Example: Rule 1" />
    </div>
  </li>
  <li>
    There can be no identical rows or columns.
    <div class="mad-example">
      <div class="madeg">
        <img src="emotes/madeg.webp" alt="Madeg" />
      </div>
      <img src="example/binary-ident.webp" alt="Example: Rule 3" />
    </div>
  </li>
</ul>

<hr />

<p>Each puzzle begins with several squares already filled. Prefilled cells are locked and cannot be changed.</p>
<p>Click on an empty cell to put an egg in it. Each click will change the color of the egg.</p>
<p>
  The timer starts once you reveal the starting position. The timer stops when the game ends. Abandoning the game does
  not stop the timer!
</p>

<hr />

<p>
  <strong> There will be a new puzzle every day! Keep playing and share your score with friends! </strong>
</p>

<p>
  <small>
    Game concept is also known as Takuzu or Binary Sudoku.
    <br />
    Design is based on
    <a class="text-success" href="https://0hh1.com/" rel="noreferrer" target="_blank">0h h1</a>
    logic game.
  </small>
</p>

<style>
  img.main {
    margin-left: 5%;
    width: 90%;
    height: auto;
  }

  .mad-example {
    width: 88%;
    height: auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1em;
  }
  .mad-example > img {
    flex: 1 0 auto;
    width: 75%;
    height: auto;
  }
  .madeg {
    flex: 0 auto;
    display: flex;
  }
  .madeg img {
    margin: auto;
    width: 80%;
    height: auto;
  }

  @media all and (max-width: 400px) {
    .madeg img {
      height: 20%;
    }
  }
</style>
