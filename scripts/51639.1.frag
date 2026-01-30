
// CannabisLeafs by Sin 2016-Apr-20

// https://www.shadertoy.com/view/lscSWS

// Tags: 2d, sin, animation, 420

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// formula:
// http://www.wolframalpha.com/input/?i=polar+(1%2Bsin(theta))*(1%2B0.9+*+cos(8*theta))*(1%2B0.1*cos(24*theta))*(0.9%2B0.05*cos(200*theta))+from+theta%3D0+to+2*Pi
// http://www.wolframalpha.com/input/?i=cannabis+curve
// http://mathworld.wolfram.com/CannabisCurve.html
float weed(vec2 uv)
{
    float d = 1.0;
    float count = 7.0;
    float rad = 0.8;
    uv.y += 0.35; 
    
    float theta = atan(uv.y, uv.x); 	
    float r = 0.2* (1.+sin(theta))*(1.+.9 * cos(8.*theta))*(1.+.1*cos(24.*theta))*(.9+.05*cos(200.*theta));
    float l = length(uv);
    
    d = clamp((l - r ), 0.0, 1.0);
    uv.y -= 0.2; 

    for(float i = 0.0; i < 7.0 ; ++i)
    {
      float a = time*0.2 + i / count * 6.28;
      uv += vec2(cos(a)*rad,sin(a)*rad);
    
      theta = atan(uv.y, uv.x);
     	
      r = .1* (1.+sin(theta))*(1.+.9 * cos(8.*theta))*(1.+.1*cos(24.*theta))*(.9+.05*cos(200.*theta));
      l = length(uv);
      d = min(d,clamp((l - r ), 0., 1.));
      uv -= vec2(cos(time*0.2 + i / count * 6.28)*rad,sin(time*0.2+ i / count*6.28)*rad);
    }
    return d;
}

void main()
{
  vec2 uv = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
  uv.x *= resolution.x / resolution.y;

  float fv = weed(uv+vec2(sin(time)*.01,cos(time)*.01));
	fv = smoothstep(0.0,0.2,0.2-fv);
    
  gl_FragColor = vec4(fv*0.1, fv*0.6, fv*0.2, 1.0);
}