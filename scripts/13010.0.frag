#ifdef GL_ES
precision mediump float;
#endif

float size = 40.;
uniform float time;
uniform vec2 resolution;
vec3 col;

void square(vec2 c, vec3 color)
{
    if (gl_FragCoord.y > c.y && gl_FragCoord.y < c.y + size && gl_FragCoord.x > c.x && gl_FragCoord.x < c.x + size)
	col += color;
}
void fig(vec2 v1, vec2 v2, vec2 v3, vec2 v4, vec3 color, vec2 c)
{
    square(c, color);
    square(c + v1 * size, color);
    square(c + v2 * size, color);
    square(c + v3 * size, color);
    square(c + v4 * size, color);		
}
void draw(float t)
{
if (t > 0. && t < 1.)
{
	for(float j = 1.; j < 5.; j++)		
for(float i = -2.; i < 5.; i++)		
    fig(vec2(1.,0.),vec2(2.,0.),vec2(1.,1.),vec2(1.,2.), vec3(mod(j, 2.),0.3,0.3), vec2((i*5.+j*2. - 2.)*size,resolution.y -j*2.*size));
for(float j = 0.; j < 6.; j++)		
for(float i = -2.; i < 3.; i++)		
    fig(vec2(1.,0.),vec2(2.,0.),vec2(1.,-1.),vec2(1.,-2.), vec3(0.3,mod(i, 2.),mod(j, 2.)), vec2((i*5.+j*2.+1.)*size,resolution.y -(j*2.-1.)*size));
}
if(t > 1. && t < 2.)
{
  for(float j = -2.; j < 4.; j++)		
  for(float i = 0.; i < 12.; i++)
      fig(vec2(1.,0.),vec2(1.,-1.),vec2(2.,-1.),vec2(0.,1.),vec3(mod(j, 2.),mod(i, 3.)/2., mod(i+1., 3.)), vec2((i + j*3.)*size, (i-2.*j)*size));
}
if(t > 2. && t < 3.)
{
for(float j = 0.; j < 2.; j++)		
  for(float i = -1.; i < 9.; i++)
      fig(vec2(1.,0.),vec2(1.,-1.),vec2(2.,-1.),vec2(1.,1.),vec3(mod(j, 2.)/8.,mod(i, 3.), mod((i+1.), 3.)/2.), vec2((i*2.)*size, (5.*j + 1.)*size));
for(float j = 0.; j < 2.; j++)		
  for(float i = -1.; i < 8.; i++)
      fig(vec2(1.,0.),vec2(1.,-1.),vec2(2.,1.),vec2(1.,1.),vec3(mod(i, 3.),mod(i+1., 3.), mod(j, 2.)/2.), vec2((i*2. + 1.)*size, (5.*j + 3.)*size));
}
if(t > 3. && t < 4.)
{
for(float j = 0.; j < 6.; j++)		
  for(float i = 0.; i < 6.; i++)
      fig(vec2(1.,0.),vec2(0.,1.),vec2(0.,2.),vec2(1.,2.),vec3(mod(j, 2.)/5.,mod(j, 3.)/2., mod((i+1.), 3.)/2.), vec2((i*5. + j*2. - 11.)*size, (2.*j - 3.)*size));
 for(float j = 0.; j < 6.; j++)		
  for(float i = 0.; i < 6.; i++)
      fig(vec2(1.,0.),vec2(1.,1.),vec2(1.,2.),vec2(0.,2.),vec3(mod(i, 3.)*5.,mod(i+1., 3.)*2., mod(j, 2.)), vec2((i*5. + j*2. - 13.)*size, (2.*j - 2.)*size));
}	
if(t > 4. && t < 5.)
{
 for(float j = -2.; j < 4.; j++)		
  for(float i = 0.; i < 12.; i++)
      fig(vec2(1.,0.),vec2(1.,-1.),vec2(0.,2.),vec2(0.,1.),vec3(mod(j, 2.),mod(i, 3.)/2., mod(i+1., 3.)), vec2((i + j*3.)*size, (i-2.*j)*size));
}
if (t > 5. && t < 6.)
{
for(float j = 0.; j < 2.; j++)		
  for(float i = 0.; i < 9.; i++)
      fig(vec2(1.,0.),vec2(1.,-1.),vec2(0.,1.),vec2(1.,1.),vec3(mod(j, 2.)*2.,mod(i, 3.), mod((i+1.), 3.)*1.3), vec2((i*2.)*size, (5.*j)*size));
for(float j = 0.; j < 2.; j++)		
  for(float i = 0.; i < 9.; i++)
      fig(vec2(1.,0.),vec2(0.,1.),vec2(0.,2.),vec2(1.,1.),vec3(mod(i, 3.)*5.,mod(i+1., 3.), mod(j, 2.)*2.), vec2((i*2.)*size, (5.*j + 2.)*size));
}
}
void main( void ) {
 draw(mod(time, 6.)); 
 gl_FragColor.rgb = col / 2.;
}
