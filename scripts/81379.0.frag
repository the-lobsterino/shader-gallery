precision mediump float;
varying highp vec2 textureCoordinate;
uniform sampler2D inputImageTexture;

const float PI  = 3.14159265359;
const float aoinParam1 = 0.7;

uniform float time;
uniform vec2 resolution;
// california
lowp vec3 permute(in lowp vec3 x) { return mod( x*x*34.+x, 289.); }
lowp float snoise(in lowp vec2 v) {
  lowp vec2 i = floor((v.x+v.y)*.36602540378443 + v),
      x0 = (i.x+i.y)*.211324865405187 + v - i;
  lowp float s = step(x0.x,x0.y);
  lowp vec2 j = vec2(1.0-s,s),
      x1 = x0 - j + .211324865405187, 
      x3 = x0 - .577350269189626; 
  i = mod(i,289.);
  lowp vec3 p = permute( permute( i.y + vec3(0, j.y, 1 ))+ i.x + vec3(0, j.x, 1 )   ),
       m = max( .5 - vec3(dot(x0,x0), dot(x1,x1), dot(x3,x3)), 0.),
       x = fract(p * .024390243902439) * 2. - 1.,
       h = abs(x) - .5,
      a0 = x - floor(x + .5);
  return .5 + 65. * dot( pow(m,vec3(4.))*(- 0.85373472095314*( a0*a0 + h*h )+1.79284291400159 ), a0 * vec3(x0.x,x1.x,x3.x) + h * vec3(x0.y,x1.y,x3.y));
}

void main(void)
{
    vec2 uv = gl_FragCoord.xy/resolution.y;

    
    vec2 nuv = uv;
    nuv.y -= time*.30;
    nuv.y = nuv.y*.75; // little narrow
        
    float a = snoise(nuv*10.);
    a+=snoise(nuv*20.)*.5;
    a+=snoise(nuv*30.)*.25;
    a+=snoise(nuv*40.)*.25;
        
    vec3 col = vec3(0.85, 0., 0.);
    
    float rs = a*uv.y*5.;
    
    // Red+yellow
    col.rg += rs;
    col *= 1.25;
    
    // Black    
    col *= smoothstep(.85, .80, rs) * smoothstep(.9, .85, rs);        
    
    // White
    col += smoothstep(.8, 1., rs);

    // Output to screen
    gl_FragColor = vec4(col,1.0);
}