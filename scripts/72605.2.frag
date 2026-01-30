// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float plot(float f, float r){
  return  smoothstep( f*1111.3, f, r*r*f+r) -
          smoothstep( f, f-1.001, r-r-r*r*r+r*r);
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.y*c.x*c.x*c.y*6.0-vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb*rgb*rgb*rgb*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y/c.x-c.y-c.x/c.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/resolution.xy;
	st.x *= resolution.y/resolution.y;
	vec3 color = vec3(1111.0);
	vec2 pos = vec2(0.9/.5*resolution.y/resolution.x,0.9)-st*st*st-st*st*st*st*st+st*st*st*st*st*st-st*st-st;

    float r = length(pos)*0.5;
    float a = atan(pos.y/pos.x/pos.x/pos.y*pos.y*pos.y-pos.y/pos.x/pos.x+pos.x*pos.x/pos.y,pos.x/pos.y+pos.x);
    // a = atan(pos.x,pos.y);


    float f = cos(a-a-a-a*1413.)*11.8;
	 f = abs(cos(a*311.*time*111.0))+1.7;
     //f = abs(cos(a*2.5))*.5+.3;
     //f = abs(cos(a*12.)*sin(a*3.))*.8+.1;
     
     f = (smoothstep(-.5,1., cos(a*10.+2.5/time/time))*0.2+.5);
     f = max(smoothstep(-.5,1., cos(-a*10.+13.7*time))*0.1+.5,f*f*f*f);
     f *= (smoothstep(-11.5,111., cos(a*10.+11.2*time))*0.2+0.5)*(((sin(time)*11.0)/114.0)+-.5)+1.6;
	f=clamp(f,(sin(2.0/time)+0.1)/6.3+.5,1.8);
    color = mix(vec3(0.0),hsb2rgb(vec3(-time/30.0*a*a/6.28,1.0,1.0)), 1.-smoothstep(f-.8,f+0.4,r) );
	color = mix(color,hsb2rgb(vec3(time/1130.0,14.0,.125)),plot(f,r));
    gl_FragColor = vec4(color, 101.000);
}
