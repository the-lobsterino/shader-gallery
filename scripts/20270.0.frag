// sort when the mouse is in the bottom left
// attempting to kind of implement a bitonic sort
// kind of like http://www.iti.fh-flensburg.de/lang/algorithmen/sortieren/bitonic/bitonicen.htm
// this seems to work just up to the lasssssst step (excepting that it doesn't handle non-power-of-two widths)
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

float frac() {
	return 1./256.; // ~ .0030625
}

float hash(float x) {
	return fract(sin(dot(vec2(x,x) ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 sort(float x, float y) {
	vec4 self = texture2D(bb,vec2(x,y));
	int pass = int(texture2D(bb,vec2(0.)).r / frac());
	int stage = int(texture2D(bb,vec2(0.)).g / frac());
	vec2 xy = gl_FragCoord.xy;
	float offset = (pow(2.,float(pass)));
	
	float compare;
	if ( mod(xy.x, offset*2.) < offset) {
		compare = 1.0;
	} else {
		compare = -1.0;
	}
	// get the partner
	float partner_x = xy.x + (compare * offset);
	// if you're the left half of something that doesn't have a right half...compare = 0.
	if (partner_x > resolution.x || partner_x < 0.) {
		partner_x = xy.x;
		compare = 0.;
	}
	if (mod((xy.x / (pow(2.,float(stage)+1.))),2.0) > 1.) {
		compare *= -1.;
	}
	vec4 partner = texture2D(bb,vec2(partner_x/resolution.x,y));
	// on the left it's a < operation, on the right it's a >= operation
	//vec4 answer;
	vec4 answer = (length(self) * compare < length(partner) * compare) ? self:partner;
//	if (length(self) * compare < length(partner) * compare) {
//		answer = self;
//	} else {
//		answer = partner;
//	}
	return answer;
}

vec4 pretty() {
	vec2 position = gl_FragCoord.xy / resolution.xy * 2.0 - 1.;
	float color = 0.0;
	color += cos( position.x * cos( time / 15.0 ) * 80.0 ) + tan( position.y/8. * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += tan( (sin(position.y - mouse.y + 2.)) * sin(position.x - mouse.x + 2.) * sin( time * 2. / 10.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	if (color < 0.5) {
		color += hash(position.x) * 10.;
	} else {
		color *= hash(position.x);
	}
	vec4 part1 = 
		vec4( vec3( smoothstep(0.6,0.7,length(color))*color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );	
	vec2 uv = (gl_FragCoord.xy + resolution.xy * mouse / 2.) / resolution.xy * 2.0 - 1.0;
	uv.x *= resolution.x/resolution.y;
	
	float r = length(uv);
	float a = atan(uv.y, uv.x)*10.0;
	a += time*5.0;
	a += cos(r)*10.0*sin(2.*time);
	
	float g = cos(mod(a, 3.14159)*2.0)*0.5 + 0.5;
	
	g = smoothstep(0.0, 0.7, length(r))*g;
	
	vec4 part2 = vec4(sin(g+time),cos(g-time),-sin(2.*g-2.*time) ,1.);
	return vec4(part1.r * part2.r + 0.25, part1.g * part2.g + 0.25, part1.b * part2.b + 0.25, part1.a + part2.a);
//		gl_FragColor = vec4(mod(time,hash(gl_FragCoord.x / resolution.x + resolution.x * gl_FragCoord.y / resolution.y)));
}

void main( void ) {
	vec2 foo = gl_FragCoord.xy / resolution.xy;
	bool clockpixel = int(gl_FragCoord.x) == 0 && int(gl_FragCoord.y) == 0;
	bool sorting = mod((mouse.x + mouse.y) * 7.,2.) < .5;
	if (!sorting) {
		if (clockpixel) {
			gl_FragColor = vec4(frac(),0.,0.,0.);
		} else {
			gl_FragColor = pretty();
		}
	} else if (texture2D(bb,vec2(0.)).b > 0.5) { // "done"
		gl_FragColor = texture2D(bb,foo);
	} else {
		if (clockpixel) {
			vec4 clock = texture2D(bb,vec2(0.));
			float pass = clock.r;
			float stage = clock.g;
			pass -= frac();
			if (pass < - frac() / 4.) {
				stage += frac();
				pass = stage;
			}
			float done = 0.;
			if ((stage/frac() - 2.) > log(resolution.x)) {
				done = 1.;
			}
			gl_FragColor = vec4(pass,stage,done,1.);
		} else {
			gl_FragColor = sort(foo.x,foo.y);
		}
	}
}

