#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 white = vec3(1.0, 1.0, 1.0);
const vec3 grey = vec3(0.4, 0.4, 0.4);
const vec3 red   = vec3(1.0, 0.0, 0.0);
const vec3 green = vec3(0.0, 1.0, 0.0);
const vec3 blue  = vec3(0.0, 0.0, 1.0);
const vec3 purple  = vec3(1.0, 0.0, 1.0);

bool inLine(vec2 position, vec2 a, vec2 b, float width) {
   vec2 aTob = b - a;
   vec2 aTop = position - a;
   float t = clamp(dot( aTop, aTob ) / dot( aTob, aTob), 0.0, 1.0);
   float d = length( position - (a + aTob * t) );
   return clamp( width / d, 0.0, 1.0) == 1.;
}

bool inCircle(vec2 position, vec2 offset, float size) {
   float len = length(position - offset);
   return (len < size);
}

bool inRect(vec2 position, vec2 offset, float size) {
   vec2 q = (position - offset) / size;
   return (abs(q.x) < 1.0 && abs(q.y) < 1.0);
}

bool inEllipse(vec2 position, vec2 offset, vec2 prop, float size) {
   vec2 q = (position - offset) / prop;
   return (length(q) < size);
}

bool inTriangle(vec2 position, vec2 a, vec2 b, vec2 c) {
   return(((b.x - a.x) * (position.y - a.y) > (b.y - a.y) * (position.x - a.x)) &&
          ((c.x - b.x) * (position.y - b.y) > (c.y - b.y) * (position.x - b.x)) &&
          ((a.x - c.x) * (position.y - c.y) > (a.y - c.y) * (position.x - c.x))
	  );
}

void main( void ) {
   vec3 destColor = grey;
   vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

   if (inLine (position, vec2(-.5, .0), vec2(-1.3, 0.6), 0.02)) destColor = white;
   if (inCircle (position, vec2(.3, .7), 0.2)) destColor = red;
   if (inRect(position, vec2( 0.5, -0.5), 0.25)) destColor = blue;
   if (inEllipse(position, vec2(-0.5, -0.5), vec2(1.9, 1.0), 0.2)) destColor = green;
   if (inTriangle (position, vec2(0.1,0.4), vec2(-0.5,-0.2), vec2(0.5,-0.3))) destColor = purple;

   gl_FragColor = vec4(destColor, 1.0);
}