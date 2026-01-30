#ifdef GL_ES
precision mediump float;
#endif

uniform float time; 
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

// Material alpha values
float aVoid = 0.9;
float aSand = 0.8;
float aPlant = 0.7;
float aFire = 0.6;
float aSmoke = 0.2;
float aWater = 0.5;


bool is(vec4 px, float material) {
	// Test for specific material
	return (abs(px.a - material) < 0.045);
}

bool isSolid(vec4 px) {
	// Test for any solid material
	return is(px, 1.0) || is(px, aSand) || is(px, aPlant) || is(px, aWater);
}

vec4 px(int dx, int dy) {
	// Fetch pixel RGBA at relative location
	vec2 pos = vec2(gl_FragCoord.x - float(dx), gl_FragCoord.y - float(dy));
	if ((pos.x < 0.0) || (pos.y < 0.0) || (pos.x >= resolution.x) || (pos.y >= resolution.y)) {
		return vec4(0.0);
	}
	return texture2D(backbuffer, pos / resolution);
}

float rand(int seed) {
	// Random float based on time, location and seed
	return fract(sin(time*23.254 + float(seed)*438.5345 - gl_FragCoord.x*37.2342 + gl_FragCoord.y * 73.25423)*3756.234);
}

float srand(int seed) {
	// Random float based on location and seed but not time
	return fract(sin(float(seed)*438.5345 - gl_FragCoord.x*37.2342 + gl_FragCoord.y * 73.25423)*3756.234);
}

float trand() {
	// Random float based only on time
	return fract((sin(time*0.006458)+sin(time*0.09234)+sin(time*0.7454))*953.234);
}

float xrand() {
	// Random float based on time and X coord
	return fract(sin(time*23.254 + gl_FragCoord.x*37.2342)*3756.234);
}

vec3 FireColor() {
	return vec3(0.5, 0.1, 0.03) * (10.0 * pow(rand(0), 2.0));
}

vec3 WaterColor() {
	vec2 pos = gl_FragCoord.xy / resolution;
	pos.y *= resolution.y / resolution.x;
	return vec3(0.5, 0.7, 0.9) * (0.8 + 0.3 * (sin(length(pos)*250.0-time*8.0) + sin(length(1.0-pos)*222.0-time*7.0))) + vec3(0.0, 0.1, 0.4);
}

void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution;
	vec2 mdist = pos-mouse;
	mdist.y *= resolution.y/resolution.x;
	float interfacex = resolution.x * 0.1;

	vec4 here = px(0,0);
	vec4 material = texture2D(backbuffer, vec2(0.0, 0.0));
	if (!(is(material, aSand) || is(material, aVoid) || is(material, aPlant) || is(material, aFire) || is(material, aWater))) {
		material.a = aSand;
	}

	if ((gl_FragCoord.x < interfacex) || (gl_FragCoord.y < 3.0) || (gl_FragCoord.x >= resolution.x-3.0) || (gl_FragCoord.y >= resolution.y-3.0)) {
		// This pixel is outside the game area
		gl_FragColor = vec4(0, 0, 0, 1.0);
		
		// Sand sample
		vec2 sample =  vec2(interfacex * 0.5, resolution.y - interfacex * 0.5);
		float sampledist = length(gl_FragCoord.xy - sample);
		if (length(mouse*resolution - sample) < interfacex*0.4) {material.a = aSand;}
		if (sampledist < interfacex * 0.4) {
			gl_FragColor.rgb = vec3(0.8+0.2*srand(1), 0.6+0.2*srand(2), 0.1+0.2*srand(5)) * (1.0 + 0.8 * (srand(3) - srand(7)));
		} else if (is(material, aSand) && (sampledist < interfacex * 0.43)) {
			gl_FragColor.rgb = vec3(0.0, 0.8, 0.3);
		}

		// Void sample
		sample =  vec2(interfacex * 0.5, resolution.y - interfacex * 1.5);
		sampledist = length(gl_FragCoord.xy - sample);
		if (length(mouse*resolution - sample) < interfacex*0.4) {material.a = aVoid;}
		if (sampledist < interfacex * 0.4) {
			gl_FragColor.rgb = vec3(0.1, 0.7 - 0.6 * (1.0-(1.0-pos.y)*resolution.y/interfacex - sample.y/resolution.y + 1.7), 0.8);
		} else if (is(material, aVoid) && (sampledist < interfacex * 0.43)) {
			gl_FragColor.rgb = vec3(0.0, 0.8, 0.3);
		}

		// Plant sample
		sample =  vec2(interfacex * 0.5, resolution.y - interfacex * 2.5);
		sampledist = length(gl_FragCoord.xy - sample);
		if (length(mouse*resolution - sample) < interfacex*0.4) {material.a = aPlant;}
		if (sampledist < interfacex * 0.4) {
			gl_FragColor.rgb = vec3(0.2, 0.4, 0.1);
		} else if (is(material, aPlant) && (sampledist < interfacex * 0.43)) {
			gl_FragColor.rgb = vec3(0.0, 0.8, 0.3);
		}

		// Fire sample
		sample =  vec2(interfacex * 0.5, resolution.y - interfacex * 3.5);
		sampledist = length(gl_FragCoord.xy - sample);
		if (length(mouse*resolution - sample) < interfacex*0.4) {material.a = aFire;}
		if (sampledist < interfacex * 0.4) {
			gl_FragColor.rgb = FireColor();
		} else if (is(material, aFire) && (sampledist < interfacex * 0.43)) {
			gl_FragColor.rgb = vec3(0.0, 0.8, 0.3);
		}

		// Water sample
		sample =  vec2(interfacex * 0.5, resolution.y - interfacex * 4.5);
		sampledist = length(gl_FragCoord.xy - sample);
		if (length(mouse*resolution - sample) < interfacex*0.4) {material.a = aWater;}
		if (sampledist < interfacex * 0.4) {
			gl_FragColor.rgb = WaterColor();
		} else if (is(material, aWater) && (sampledist < interfacex * 0.43)) {
			gl_FragColor.rgb = vec3(0.0, 0.8, 0.3);
		}

		// Write status pixel
		if ((gl_FragCoord.x < 1.0) && (gl_FragCoord.y < 1.0)) {
			gl_FragColor.a = material.a;
		}
		return;
	}
	
	// draw some natural sources
	if(gl_FragCoord.y > (1.+(7./resolution.y)*cos(0.4*time*(1.+time/gl_FragCoord.x)+(1.+0.03*time*cos(time/100.)+0.05*pow(1.+0.01*time, -2.)*cos(time/44.))*pow(gl_FragCoord.x, 0.777)*10./resolution.x))*resolution.y){
		if(fract(pow(time*(1.+1./(2.+cos(time*gl_FragCoord.x))), 0.123)) < 0.48+0.3*cos(time*12.)){
		material.a = aSand;
		}else{
		material.a = aWater;
		}
		mdist = vec2(0.);
	}
	if(gl_FragCoord.y + 1.1*pow(cos(time+gl_FragCoord.x/resolution.x), 2.) < resolution.y*0.009){
		if(fract(sqrt(time)) < 0.1){
			material.a = aVoid;
			mdist = vec2(0.);
		}else if(fract(sqrt(time)) < 0.2){
			material.a = aFire;
			mdist = vec2(0.);
		}
	}
	
	
	float brushsize = pow(length(resolution), -0.75);
	if (length(mdist) < brushsize) {
		if (is(material, aSand) && (rand(1) < 0.1)) {
			// This pixel is being filled with sand
			gl_FragColor.rgb = vec3(0.8+0.2*rand(1), 0.6+0.2*rand(2), 0.1+0.2*rand(5)) * (1.0 + 0.8 * (rand(3) - rand(7)));
			gl_FragColor.a = aSand;
			return;
		} else if (is(material, aPlant)) {
			float ang = trand() * 3.14159 * 2.0;
			vec2 leaf = vec2(cos(ang)*mdist.x - sin(ang)*mdist.y,
					 sin(ang)*mdist.x + cos(ang)*mdist.y);
			leaf.x *= 3.0;
			if (length(leaf) < brushsize) {
				float edge = pow(1.0-length(leaf)/brushsize, 0.3) * 0.5 + 0.75;
				gl_FragColor.rgb = vec3(0.2, 0.4, 0.1) * (1.0 + 0.5*trand()) * edge;
				gl_FragColor.a = aPlant;
				return;
			}
		} else if (is(material, aVoid) && !is(here, aVoid)) {
			// This pixel is being erased
			gl_FragColor.rgb = vec3(1);
			gl_FragColor.a = aVoid;
			return;
		} else if (is(material, aFire) && (rand(1) < 0.02) && !is(here, aSand)) {
			// This pixel is being ignited
			gl_FragColor.rgb = vec3(1.0);
			gl_FragColor.a = aFire;
			return;
		} else if (is(material, aWater) && (rand(1) < 0.02))  {
			// Drop a water pixel here
			gl_FragColor.rgb = WaterColor();
			gl_FragColor.a = aWater;
			return;
		}
	}

	int sandslide = (trand() > 0.5) ? -1 : 1;
	vec4 below = px(0,1);
	vec4 above = px(0,-1);
	vec4 belowside = px(sandslide,1);
	vec4 aboveside = px(-sandslide,-1);
	
	if (is(here, aPlant)) {
		float firecheck = 0.0;
		if (is(above, aFire)) {firecheck += (rand(11) > 0.8) ? 1.0 : 0.1;}
		if (is(below, aFire)) {firecheck += (rand(12) > 0.4) ? 1.0 : 0.1;}
		if (is(px(1,0), aFire)) {firecheck += (rand(13) > 0.6) ? 1.0 : 0.1;}
		if (is(px(-1,0), aFire)) {firecheck += (rand(14) > 0.6) ? 1.0 : 0.1;}
		if (firecheck >= 1.0) {
			gl_FragColor.rgb = FireColor();
			gl_FragColor.a = aFire;
			return;
		} else if (firecheck > 0.0) {
			here.rgb *= 0.8;
		}
		// This is a stable plant pixel
		gl_FragColor = here;
		return;
	} else if (is(here, aFire)) {
		if (rand(10) < 0.7) {
			gl_FragColor.rgb = FireColor();
			gl_FragColor.a = aFire;
			return;
		}
	} else if (is(here, aSand)) {
		if (isSolid(below) && (isSolid(belowside) || isSolid(px(sandslide,0)))) {
			if ((is(below, aWater)) && (xrand() > 0.6)) {
				// Sand sinks in water
				gl_FragColor.rgb = WaterColor();
				gl_FragColor.a = aWater;
				return;
			}
			// This sand grain is at rest
			gl_FragColor = here;
			return;
		}
	} else if (is(here, aWater)) {
		if ((is(above, aSand)) && (xrand() > 0.6)) {
			// Water floats in sand
			gl_FragColor = above;
			return;
		}
		if (isSolid(below) && (isSolid(px(sandslide,0)) || isSolid(px(sandslide,-1)))) {
			vec4 there = px(int(rand(3)*3.0)-1, int(rand(5)*3.0)-1);
			if ((is(there, aPlant)) && (rand(25) < 0.1)) {
				// Plant grows in water
				gl_FragColor = there;
				gl_FragColor.rgb *= 1.0 + 0.1 * rand(14) - 0.1 * rand(15);
				if ((gl_FragColor.g < 0.1) || (gl_FragColor.r > 0.9)) {
					gl_FragColor.rgb = vec3(0.2, 0.4, 0.1);
				}
				return;
			}
			
			// This water particle is at rest
			gl_FragColor.rgb = WaterColor();
			gl_FragColor.a = aWater;
			return;
		}
	} else if (is(here, aVoid) || is(here, aSmoke)) {
		if (is(above, aSand)) {
			// A sand grain is falling into this pixel
			gl_FragColor = above;
			return;
		}
		if (is(aboveside, aSand) && isSolid(px(-sandslide, 0)) && !isSolid(above)) {
			// A sand grain is sliding down a slope into this pixel
			gl_FragColor = aboveside;
			return;
		}
		if ( is(above, aWater) || 
		     (is(px(-sandslide, 0), aWater) && isSolid(px(-sandslide, 1)) && !isSolid(above)) ) {
			// A water drop is going here
			gl_FragColor.rgb = WaterColor();
			gl_FragColor.a = aWater;
			return;
		}
		if (is(below, aFire)) {
			// Fire is below this pixel; Propogate fire or smoke
			if (rand(5) < 0.4) {
				gl_FragColor.rgb = FireColor();
				gl_FragColor.a = aFire;
				return;
			}
			gl_FragColor.rgb = vec3(0.2);
			gl_FragColor.a = aSmoke;
			return;
		}
		if (is(below, aSmoke) && (rand(3) < 0.95)) {
			// Smoke is below this pixel; large chance for it to boil upwards
			gl_FragColor.rgb = vec3(0.2);
			gl_FragColor.a = aSmoke;
			return;
		}
	}
	
	// This pixel is a void
	gl_FragColor.rgb = vec3(0.1, 0.7 - 0.6 * pos.y, 0.8);
	gl_FragColor.a = aVoid;
}