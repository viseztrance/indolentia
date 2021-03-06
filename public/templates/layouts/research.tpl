<h2>Research</h2> <a href="#" class="back">Map</a>
<br />
<p>Funds: {{ UI.game.currentPlayer.creditsPerTurn().technology }} credits</p>

<div class="wrapper">
  <section class="available">
    <nav>
      <ul>
      {% for(var name in budget): %}
        <li>
            <h4>
                <a href="#" data-content-for="{{ name }}">{{ name }}</a>
            </h4>
        </li>
      {% endfor; %}
      </ul>
    </nav>

    <div class="contents">
      {% for(var name in budget): %}
        <div id="<%= name %>-content">
          <ul>
          {% for(var i in technologies[name].available): %}
            <li>
              {{ technologies[name].available[i].name }}<br />
              <small>{{ technologies[name].available[i].description }}</small>
            </li>
          {% endfor; %}
          </ul>
        </div>
      {% endfor; %}
    </div>
  </section>

  <section class="researching">
    <ul>
      {% for(var name in budget): %}
        <li>
          <label>{{ name }}</label>
          <input type="text" class="slider" name="{{ name }}" value="" />
          <p>
            {% if(technologies[name].researching.item): %}
              {{ technologies[name].researching.item.name }} |
              Lvl: {{ technologies[name].researching.item.level }} |
              {{ (technologies[name].researching.credits / technologies[name].researching.item.cost()) * 100 }}%
            {% else: %}
              <em>Nothing is being researched</em>
            {% endif; %}
          </p>
        </li>
      {% endfor; %}
    </ul>
  </section>
</div>
