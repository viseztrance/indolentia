<h2><%= name %></h2>
<div class="preview">
  <img src="<%= preview %>" alt="" />
  <% if(explored) { %>
    <span>max <%= maxPopulation %> pop</span>
  <% } %>
</div>

<% if(currentPlayer) { %>
  <section>
    <dl>
      <dt>Population</dt>
      <dd><%= currentPopulation %></dd>
    </dl>
    <dl>
      <dt>Production</dt>
      <dd><%= factories %></dd>
    </dl>
    <dl>
      <dt>Bases</dt>
      <dd>0</dd>
    </dl>
  </section>

  <section class="controls">
    <ul>
      <li>
        <label>Ship</label>
        <input type="text" class="slider" name="test" value="15" />
      </li>

      <li>
        <label>Defence</label>
        <input type="text" class="slider" name="test" value="19" />
      </li>

      <li>
        <label>Industry</label>
        <input type="text" class="slider" name="test" value="25" />
      </li>

      <li>
        <label>Ecology</label>
        <input type="text" class="slider" name="test" value="36" />
      </li>

      <li>
        <label>Tech</label>
        <input type="text" class="slider" name="test" value="5" />
      </li>
    </ul>
  </section>
<% } %>
