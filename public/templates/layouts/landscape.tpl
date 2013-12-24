<h2>Landscape</h2>
<dl>
    <dt>Size</dt>
    <dd>{{ star.attributes.maxPopulation }}</dd>

    <dt>Factories</dt>
    <dd>{{ star.attributes.factories }}</dd>

    <dt>Waste</dt>
    <dd>{{ star.attributes.waste }}</dd>

    <dt>Population</dt>
    <dd>{{ star.attributes.population }}</dd>

    <dt>Growth</dt>
    <dd>{{ star.populationGrowth(star.creditsPerTurn().forPopulation()) }}</dd>
</dl>
