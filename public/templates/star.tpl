<h2>{{ name }}</h2>
<div class="preview">
  {% if(explored): %}
    <span>max {{ maxPopulation }} pop</span>
  {% endif; %}
  <img src="{{ preview }}" alt="" />
</div>

{% if(currentPlayer): %}
  <section class="stats">
    <dl>
      <dt>Population</dt>
      <dd>{{ Math.floor(population) }}</dd>
      <dt>Bases</dt>
      <dd>0</dd>
    </dl>
    <dl>
      <dt>Production</dt>
      <dd>{{ activeFactories }}</dd>
      <dt>Waste</dt>
      <dd>{{ waste }}</dd>
    </dl>
  </section>

  <section class="controls">
    <ul>
      <li>
        <label>Ship</label>
        <input type="text" class="slider" name="ship" value="" />
      </li>

      <li>
        <label>Defence</label>
        <input type="text" class="slider" name="defence" value="" />
      </li>

      <li>
        <label>Industry</label>
        <input type="text" class="slider" name="industry" value="" />
      </li>

      <li>
        <label>Ecology</label>
        <input type="text" class="slider" name="population" value="" />
      </li>

      <li>
        <label>Tech</label>
        <input type="text" class="slider" name="technology" value="" />
      </li>
    </ul>
  </section>
{% endif; %}

<p>
  <a href="#" id="end-turn-link">Next turn</a> | <a href="#" id="research-link">Research</a>
</p>
