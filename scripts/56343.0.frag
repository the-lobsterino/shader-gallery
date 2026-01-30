#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}
vec3 randomColor (vec2 st) {
    return vec3(random(st.rg), random(st.gg), random(st.gr));
}

vec4 circle(in vec2 center, in float radius, in vec4 color, in vec2 st){
    float dist = distance(center, st);
     float pct = 1.0 - step(radius, dist);
    return color * pct;
}

float expandingCircles(vec2 center, vec2 st)
{
    return sin(sqrt(distance(st, center)) * 100.  - time * 10.);
}

vec3 expandingCirclesColor(vec2 center, vec2 st)
{
    float dist = sqrt(distance(st, center)) * 100.- time * 10.;
    float indCircle = floor(dist / PI);
    vec3 color = randomColor(vec2(indCircle, -indCircle));
    return sin(dist) * color;
}

void main(){
    
    vec2 st = gl_FragCoord.xy/vec2(min(resolution.x, resolution.y));

    float centerMult = 3. + sin(time * 0.3) * 2.; 
	
    float cornerMult = 0.3;

    vec3 color = centerMult * expandingCirclesColor(vec2(.5), st)
        - cornerMult * expandingCirclesColor(vec2(0.0), st)
        - cornerMult * expandingCirclesColor(vec2(1.0), st)
        - cornerMult * expandingCirclesColor(vec2(0.0, 1.0), st)
        - cornerMult * expandingCirclesColor(vec2(1.0, 0.0), st);

    gl_FragColor = vec4(random(vec2(time,2)),random(vec2(time,4)),random(vec2(time,1)),random(vec2(time,8)));

}