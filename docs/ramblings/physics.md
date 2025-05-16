# Settings

## My original settings

The program originally (and currently) uses the following settings:

| Setting | Value |
| --- | --- |
| starThreshold | 0.8 |
| size | 20 |
| numBodies | 500 |
| minMass | 0.001 |
| maxMass | 0.1 |
| initialVelocityMultiplier | 0.05 |


These settings produce a visually pleasing result, but there are some glaring flaws in physical accuracy:

### Star Formation
The threshold for the mass required for star formation is off by a factor of 10 - The real value is actually around 0.08 solar masses. Here's a short chart showing some existing stars and star milestones.

| Object                 | Mass (Solar) | Type             | Radius (AU) |
|------------------------|--------------|------------------|-------------|
| Brown Dwarf            | 0.013        | Threshold        | 0.0005      |
| Star Formation         | 0.08         | Threshold        | 0.001       |
| White Dwarf            | 0.17–1.4     | Stellar Remnant  | 0.000005    |
| Neutron Star           | 1.1–2.3      | Stellar Remnant  | 0.00000003  |
| Sol                    | 1            | Main Sequence    | 0.00465     |
| Pollux                 | 1.91         | Giant            | 0.019       |
| Sirius A               | 2.06         | Main Sequence    | 0.008       |
| Betelgeuse             | 11–20        | Red Supergiant   | 4.3–5.2     |
| VY Canis Majoris       | 17           | Red Hypergiant   | 6.5         |
| Eta Carinae A          | 100–150      | Blue Hypergiant  | 0.03        |

Something important to note here is that stellar radius is not necessarily proportional to stellar mass - Stars in the later stages of their life often grow in size as they consume hydrogen

### Planetary Masses
The range of most masses are much larger than any planets in our solar sytem. Our minimum is larger than jupiter. 

| Body        | Mass (Solar)   | Mass (Earths) | Mass (kg)         |
|-------------|----------------|---------------|-------------------|
| Current Min | 0.001          | 333.59        | 1.989 × 10²⁷      |
| Jupiter     | 0.000954588    | 318.00        | 1.898 × 10²⁷      |
| Saturn      | 0.0002857169   | 95.16         | 5.684 × 10²⁶      |
| Neptune     | 0.0000515139   | 17.15         | 1.024 × 10²⁶      |
| Uranus      | 0.0000444292   | 14.54         | 8.681 × 10²⁵      |
| Earth       | 0.000003003    | 1.00          | 5.972 × 10²⁴      |
| Venus       | 0.000002447    | 0.815         | 4.867 × 10²⁴      |
| Mars        | 0.0000003227   | 0.1075        | 6.417 × 10²³      |
| Mercury     | 0.000000165    | 0.05495       | 3.282 × 10²³      |
| Ganymede    | 0.0000000756   | 0.0252        | 1.481 × 10²³      |
| Titan       | 0.0000000702   | 0.0234        | 1.345 × 10²³      |
| Luna        | 0.0000000363   | 0.0123        | 7.347 × 10²²      |
| Pluto       | 0.00000000218  | 0.000726      | 4.336 × 10²¹      |
| Ceres       | 0.00000000047  | 0.000157      | 9.393 × 10²⁰      |
| Vesta       | 0.00000000013  | 0.0000434     | 2.590 × 10²⁰      |


### Total Mass
The average mass of a system with the above settings is 25 solar masses. Our solar system has a mass of a little more than 1 solar mass, and I imagine most solar systems have the same configuration (where the size of their central star is practically the mass of the entire system).

## The Goal and the Problems

The ultimate goal of this simulation is not to produce results which are 100% physically accurate. I want to make something which is visually engaging and somewhat intuitive, and I'm willing to sacrifice some physics in service of that goal. However, it's important to me that we show a wider range of masses. At minimum, a mercury-sized mass should be readily visible. There are problems with the current implementation that need to be addressed to actually make this work:

### Current radius calculation

Planets are very hard to see with the current planetary radius calculation (M^(1/3) * 0.1). One solution is to increase the zoom level and dynamically clamp it based on the followed body's radius. I want to implement this, but it's not sufficient. Seeing bodies interact with each other is paramount, and you can't achieve this if you must zoom in on each body. Therefore, the best solution is to adjust the current radius calculation to make smaller bodies more visible. Here's a potentially-useful reference chart for planetary radii:

| Body        | Radius(AU) | Radius(Solar)  | Radius(Earth)  | Radius(km)       |
|-------------|------------|----------------|----------------|------------------|
| Sun         | 0.00465    | 1.000          | 109.2          | 6.960 × 10⁵      |
| Jupiter     | 0.00048    | 0.100          | 11.21          | 7.149 × 10⁴      |
| Saturn      | 0.00040    | 0.084          | 9.45           | 6.026 × 10⁴      |
| Uranus      | 0.00017    | 0.036          | 4.01           | 2.536 × 10⁴      |
| Neptune     | 0.00016    | 0.035          | 3.88           | 2.462 × 10⁴      |
| Earth       | 0.000043   | 0.009          | 1.00           | 6.371 × 10³      |
| Venus       | 0.000040   | 0.009          | 0.95           | 6.052 × 10³      |
| Mars        | 0.000023   | 0.005          | 0.53           | 3.390 × 10³      |
| Mercury     | 0.000016   | 0.004          | 0.38           | 2.440 × 10³      |
| Ganymede    | 0.000018   | 0.004          | 0.41           | 2.634 × 10³      |
| Titan       | 0.000017   | 0.004          | 0.40           | 2.575 × 10³      |
| Luna        | 0.000012   | 0.003          | 0.27           | 1.737 × 10³      |
| Pluto       | 0.000008   | 0.002          | 0.18           | 1.188 × 10³      |
| Ceres       | 0.0000032  | 0.001          | 0.07           | 4.730 × 10²      |
| Vesta       | 0.0000017  | 0.001          | 0.05           | 2.620 × 10²      |

### Radius and Phyics

In my simulation, when the radii of two bodies touch, they merge. An option I briefly considered was to separate actual radius from its eggagerated for-rendering radius in merging calculations, but this makes the simulation less visually appealing and intuitive. So, I decided to sacrifice another element of physics for the sake of user intuition.

With that being said: When we reexamine the radius calculation, we don't want bodies to be large to an absurd degre - For example, if we scale 1 solar mass to have a size of 1 AU, then we wouldn't be able to include the orbits of most of our inner planets, and couldn't do fun stuff like include a habitable zone. We might also have some problems with planets intersecting each other's orbits:

I think a good first-step in retooling our radius is to create a debug setting to render circles at 1, 5, 10, 20, and 50 AU, just for a more intuitive visual reference.

Here's a chart showing distance from the sun in AU:

| Body      | Distance from Sun (AU) |
|-----------|------------------------|
| Sun       | 0.000                  |
| Mercury   | 0.39                   |
| Venus     | 0.72                   |
| Earth     | 1.00                   |
| Mars      | 1.52                   |
| Vesta     | 2.36                   |
| Ceres     | 2.77                   |
| Jupiter   | 5.20                   |
| Saturn    | 9.58                   |
| Uranus    | 19.22                  |
| Neptune   | 30.05                  |
| Pluto     | 39.48                  |


### Other simulation parameters

The other problem I ran into when setting smaller masses for objects is that, if other settings (universe size, initial velocity) are unchanged, the system ends up flying apart. I'd like to come up with some parameters that can keep smaller bodies gravitationally bound by default, without necessarily having a central parent star (as it's enjoyable to watch them form).