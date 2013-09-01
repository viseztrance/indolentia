<h2>Research</h2> <a href="#" class="back">Map</a>
<br />

<div class="wrapper">
  <section class="available">
    <nav>
      <ul>
      <% for(var name in budget) { %>
        <li><h4><a href="#" data-content-for="<%= name %>"><%= name %></a></h4></li>
      <% } %>
      </ul>
    </nav>

    <div class="contents">
      <% for(var name in budget) { %>
        <div id="<%= name %>-content">
          <ul>
          <% for(var i in technologies[name].available) { %>
            <li>
              <%= technologies[name].available[i].name %><br />
              <small><%= technologies[name].available[i].description %></small>
            </li>
          <% } %>
          </ul>
        </div>
      <% } %>
    </div>
  </section>

  <section class="researching">
    <ul>
      <% for(var name in budget) { %>
        <li>
          <label><%= name %></label>
          <input type="text" class="slider" name="<%= name %>" value="" />
          <p>
            <%= technologies[name].researching.item.name %> |
            Lvl: <%= technologies[name].researching.item.level %> |
            <%= (technologies[name].researching.credits / technologies[name].researching.item.cost()) * 100 %>%
          </p>
        </li>
      <% } %>
    </ul>
  </section>
</div>
