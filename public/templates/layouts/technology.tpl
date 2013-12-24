<h2>Choose the area of research our scientists now focus on</h2>

<h4>{{ researchedTechnology.category }} Technology</h4>

<ul>
  {% technologies.slice(0, 2).forEach(function(technology) { %}
    <li>
      <a href="#" class="choice" title="{{ technology.description }} ({{ technology.cost() }} credits)" data-level="{{ technology.level }}">
        {{ technology.name }}
      </a>
    </li>
  {% }); %}
</ul>