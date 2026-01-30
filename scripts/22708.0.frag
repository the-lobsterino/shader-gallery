//---------------------------------------------------------
// Shader:   ConvaysGameOfLife.glsl
// Conway's Game of Life
//---------------------------------------------------------
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

//---------------------------------------------------------
vec4 live = vec4(0.796, 0.933, 0.141, 1.0);
vec4 dead = vec4(0.184, 0.292, 0.086, 1.0);
vec4 dirt = vec4(0.378, 0.231, 0.228, 1.0);
vec4 decay = vec4(0.149, 0.11, 0.118, 0.0);

//---------------------------------------------------------
void main( void ) 
{
  vec2 position = ( gl_FragCoord.xy / resolution.xy );
  vec2 pixel = 1./resolution;

  if (length(position-mouse) < 0.01) 
  {
    float rnd1 = mod(fract(sin(dot(position + time * 0.001, vec2(14.9898, 78.233))) * 43758.5453), 1.0);
    gl_FragColor = (rnd1 > 0.5) ? live : dead;
  } 
  else 
  {
    int sum = 0;
    sum += (texture2D(backbuffer, position + pixel * vec2(-1.,-1.)).g > 0.9) ? 1 : 0;
    sum += (texture2D(backbuffer, position + pixel * vec2(-1., 0.)).g > 0.9) ? 1 : 0;
    sum += (texture2D(backbuffer, position + pixel * vec2(-1., 1.)).g > 0.9) ? 1 : 0;
    sum += (texture2D(backbuffer, position + pixel * vec2( 1.,-1.)).g > 0.9) ? 1 : 0;
    sum += (texture2D(backbuffer, position + pixel * vec2( 1., 0.)).g > 0.9) ? 1 : 0;
    sum += (texture2D(backbuffer, position + pixel * vec2( 1., 1.)).g > 0.9) ? 1 : 0;
    sum += (texture2D(backbuffer, position + pixel * vec2( 0.,-1.)).g > 0.9) ? 1 : 0;
    sum += (texture2D(backbuffer, position + pixel * vec2( 0., 1.)).g > 0.9) ? 1 : 0;
    vec4 me = texture2D(backbuffer, position);

    if (sum == 3)           // set/obtain cell ?
    {
      gl_FragColor = live;
    }
    else if (me.g > 0.9)    // cell alive ?
    {
      gl_FragColor = (sum == 2) ? live : dead;
    }
    else if ((me.b > 0.2) || (me.b < 0.01)) 
    {
      gl_FragColor = dirt;
    }
    else 
    {
      if (me.r > decay.r) 
        me.r -= 0.004;
      else if (me.g > decay.g) 
        me.g -= 0.004;
      else if (me.b < decay.b) 
        me.b += 0.004;
      else 
        me = decay;
      gl_FragColor = me;
    }
  }
}
