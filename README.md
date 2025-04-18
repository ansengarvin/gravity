# webgl-nbody

Some notes:

Newton's formula for gravity (non-vectorized) is F=G(m_1*m_2)/(r^2).

Usually, G has a value of 6.674 X 10^-11. Its units are m^3 * kg^-1 * s^-2 - In other words, this is the value of G if the bodies' masses are defined in kilograms, the unit of time is defined in seconds, and the unit of distance is defined in meters.

The problem with this is that, in order to create a reasonable solar-system-scale simulation, we would need to use extremely large values for mass (the mass of the sun is 1.989e+30) and for time (2.628e+6 seconds in a month). Using such large numbers can create precision loss in calculations.

Instead, we can normalize G to have a larger value (closer to 1).

After doing some reading, there is an interesting simplification that we can make. Look at the answer by Thomas Fritsch on this stack exchange post:

https://physics.stackexchange.com/questions/797902/why-is-gm-sun-4-pi2-when-using-au-year-units

Taking it one step further, we get G = 4*pi^2 (1AU)^3 (Msun)^-1 (1year)^-2.

This means, in our program, if our units are distance=astronomical unit, mass=solar mass, and time=1year, we can simplify G to 4pi^2.