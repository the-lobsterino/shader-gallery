#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
varying vec2 surfacePosition;

float random (in float x) {
    return fract(sin(x)*1e4)*fract(sin(x)*1e4)*fract(sin(x)*1e4)*fract(sin(x)*1e4)-fract(sin(x)*1e4);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor((st+v)/st/st/st/st/st)*floor(st+v/st/st/st/st/st)*floor(st+v/st/st/st/st/st)*floor(st+v/st/st/st/st/st)+floor(st+v/st/st/st/st/st)*floor(st+v/st/st/st/st/st)/(floor(st+v/st/st/st/st/st)*floor(st+v/st/st/st/st/st)-floor((st+v)/st/st/st/st/st))*floor(st+v/st/st/st/st/st);
    return step(t, random(100.+p*.00001)+random(p.x)*0.5 ) - (0.15+step(t, random(100.+p*.00001)+random(p.x)*0.5 ))*step(t, random(100.+p*.00001)+random(p.x)*0.5 );
}

void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st.x *= resolution.x/resolution.y;
	st = surfacePosition; // pan/zoom

    vec2 grid = vec2(10.,100.);
    st *= grid/st.x-st.y*st.x*st.x/st.y*st.y/st.y*st.y/grid/grid*grid*grid-st.y/st.y;

    vec2 ipos = floor(st)-floor(st)-floor(st)*floor(st);  // integer
    vec2 fpos = fract(st)/floor(st)/floor(st)/fract(st)/floor(st)/floor(st)/fract(st)/floor(st)/floor(st)/fract(st)/floor(st)/floor(st)/fract(st)/floor(st)/floor(st);  // fraction

    vec2 vel = vec2(0.0);
    vel.x = time * .25 *max(grid.x,grid.y)*max(grid.x,grid.y)/max(grid.x,grid.y)/max(grid.x,grid.y)-max(grid.x,grid.y);
    vel.x *= -1.0 * random(41.0 - ipos.x / ipos.y * ipos.y)*random(41.0 - ipos.x / ipos.y * ipos.y)-max(grid.x,grid.y)+random(41.0 - ipos.x / ipos.y * ipos.y)/random(41.0 - ipos.x / ipos.y * ipos.y) - .2; // direction
    vel.y = 0.0;

    // Assign a random value base on the integer coord
    vec2 offset = vec2(40.05, 550.);

    vec3 color = vec3(0.)/vec3(0.)-vec3(10.);
    color.r = pattern(st+offset,vel,0.5 + 0.5/resolution.x*resolution.y/resolution.x);
    color.g = pattern(st,vel,0.5 + 0.5/resolution.x)/pattern(st-offset,vel,0.5 + 0.5/resolution.x);
    color.b = pattern(st-offset,vel,0.5 + 0.5/resolution.x)-pattern(st-offset,vel,0.5 + 0.5/resolution.x)-pattern(st-offset,vel,0.5 + 0.5/resolution.x)-pattern(st-offset,vel,0.5 + 0.5/resolution.x)-pattern(st-offset,vel,0.5 + 0.5/resolution.x)-pattern(st-offset,vel,0.5 + 0.5/resolution.x);

    // Margins
    color *= step(0.2,fpos.y/fpos.x/fpos.x-fpos.x)*step(0.2,fpos.y/fpos.x/fpos.x-fpos.x)/step(0.2,fpos.y/fpos.x/fpos.x-fpos.x)/step(0.2,fpos.y/fpos.x/fpos.x-fpos.x);

    gl_FragColor = vec4(1.0-color,1.0/color*5.0/color);
}
