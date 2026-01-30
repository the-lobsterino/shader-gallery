//This is extracted from one of DestroyThingsBeautiful's QTZ Packages
//I don't know where or when I found it.
//It's my absolute favourite shader of all times


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : disable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D S2;
#define T2(D) texture2D(S2, fract((gl_FragCoord.xy+D)/resolution))
#define TX(L,D) (( T2(D+vec2(L)) + T2(D+vec2(-L)) + T2(D+vec2(-L,L)) + T2(D+vec2(L,-L)) )/4.)


// Tweaked by T21 : 3d noise

float rand(vec3 n, float res)
{
  n = floor(n*res+.5+.03*time);
  return fract(sin((n.x+n.y*1e2+n.z*1e4)*1e-4)*1e5);
}

float map( vec3 p )
{
    p = mod(p,vec3(1.0, 1.0, 1.0))-0.5;
    return length(p.xy)-.1;
}
	
void main( void )
{
    vec2 pos = 4.*(gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;
    vec3 camPos = vec3(time*sqrt(.25), time*0.4, cos(time/29.)*20.);
    vec3 camTarget = vec3(0.0, 0.0, 0.0);

    vec3 camDir = normalize(camTarget-camPos);
    vec3 camUp  = normalize(vec3(0.0, 1.0, 0.0));
    vec3 camSide = cross(camDir, camUp);
    float focus = 2.0;

    vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);
    vec3 ray = camPos;
    float d = 0.0, total_d = 0.0;
    const int MAX_MARCH = 100;
    const float MAX_DISTANCE = 5.0;
    float c = 1.0;
    for(int i=0; i<MAX_MARCH; ++i) {
        d = map(ray);
        total_d += d;
        ray += rayDir * d;
        if(abs(d)<0.001) { break; }
        if(total_d>MAX_DISTANCE) { c = 0.; total_d=MAX_DISTANCE; break; }
    }
	
    float fog = 5.0;
    vec4 result = vec4( vec3(.88,1.,.5) * c * (fog - total_d) / fog, 1.0 );
    ray.z += 3.0*cos(floor(ray.x*3.+ray.y*2.));
    float r = rand(ray, 22.);
    gl_FragColor = result*(step(r,.3)+r*.2+.1);
	gl_FragColor *= gl_FragColor;
	gl_FragColor = max(gl_FragColor, TX(2.,0.)-1./256.);
}