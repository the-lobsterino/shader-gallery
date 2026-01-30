#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 pixel = 1./resolution;
	vec4 me = texture2D(backbuffer, position);
	float mt = time * 0.1 - 234.3453;

	float rnd1 = mod(fract(sin(dot(position + mt * 0.001, vec2(14.9898,78.233))) * 43758.5453), 1.0);
	float rnd2 = mod(fract(sin(dot(position + mt * 0.001, vec2(24.9898,44.233))) * 27458.5453), 1.0);
	rnd1 = fract(rnd1*37.345 + rnd2*15.23524);
	rnd2 = fract(rnd1*25.324 + rnd2*42.25323);
	float nudgex = 20.0 * cos(mt * 0.03775);
	float nudgey = 20.0 * cos(mt * 0.02246);
	float ratex = -0.0005 + 0.002 * (0.5 + 0.5 * sin(nudgex * position.y + mt * 0.137));
	float ratey = -0.0005 + 0.002 * (0.5 + 0.5 * sin(nudgey * position.x + mt * 0.262));

	vec4 new = vec4(0.0, 0.0, 0.0, 1.0);
	vec3 rainbow = vec3(0.0);
	
	vec2 cen = position-0.5;
	cen.y *= resolution.y/resolution.x;
	
	float ca = atan(cen.y, cen.x);
	rainbow.r = 0.5+0.5*sin(mt * 0.3 * 1.234542 + ca);
	rainbow.g = 0.5+0.5*sin(3.0 + mt * 0.3 * -1.64242 + ca);
	rainbow.b = 0.5+0.5*sin(4.0 + mt * 0.3 * 0.244242 + ca);
	
	float multx = 1.0 - ratex;
	float multy = 1.0 - ratey;
	float j = 1.01;
	float jitterx = j / resolution.x;
	float jittery = j / resolution.y;
	float offsetx = (ratex - jitterx) * 0.5;
	float offsety = (ratey - jittery) * 0.5;
	vec4 source = texture2D(backbuffer, vec2(position.x * multx + offsetx + jitterx * rnd1 , position.y * multy + offsety + jittery * rnd2));
	new.r = source.r;
	new.g = source.g;
	new.b = source.b;

	float mx = 233.0/255.0;
	new.rgb = new.rgb*mx + me.rgb * (1.0-mx);
	
	mx = max(0.0, min(1.0, 0.03-length(cen)*2.0));
	if (me.a < 1.0) {mx = 1.0;}
	new.rgb = rainbow*mx + new.rgb * (1.0-mx);
	
	gl_FragColor = new;
}
