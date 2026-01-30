#ifdef GL_ES
precision mediump float;
#endif

// Fluid Simulation by Foxel <storkner@gmail.com>
// Data usage:
//             x := fluid velocity x
//             y := fluid velocity y
//             z := fluid height
//             w := not used (maybe later for terrain height)

#define paint_size 25.0
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buffer;
 
vec4 wi;
vec2 uv;
vec2 uvp;
 
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buffer;
 
vec4 wi;
vec4 fluidInfo( vec2 point) {
	vec4 f = texture2D(buffer, point);
	f.xy *= 2.0;
	f.xy -= 1.0;
	return f;
}

void draw() {
	wi.xy += 1.0;
	wi.xy *= 0.5;
	wi.w = 1.0;
	gl_FragColor = wi;
}

// TODO: create a cool terrain =)
float terrainHeight(vec2 point){
	return 0.0;
}
 
void clear() {
	gl_FragColor = vec4(0.5,0.5,0.0,1);
}

void calcFloat() {
	
	vec4 f = vec4(0.0);
 
	vec2 uv_r = uv + vec2(uvp.x, 0.0);
	vec2 uv_l = uv - vec2(uvp.x, 0.0);
	vec2 uv_u = uv + vec2(0.0, uvp.y);
	vec2 uv_d = uv - vec2(0.0, uvp.y);
 
	vec4 wir = fluidInfo(uv_r);
	vec4 wil = fluidInfo(uv_l);
	vec4 wiu = fluidInfo(uv_u);
	vec4 wid = fluidInfo(uv_d);
 
	// Watter height difference
	float dr = wi.z - wir.z;
	float dl = wi.z - wil.z;
	float du = wi.z - wiu.z;
	float dd = wi.z - wid.z;
 
	// vectoring
	f.xy += wir.xy + wil.xy + wiu.xy + wid.xy;
 
	if(terrainHeight(uv) < wir.z){ // fill in from right
		f.x -= dr;
	}
	if(terrainHeight(uv) < wil.z){ // fill in from left
		f.x += dl;
	}
	if(terrainHeight(uv) < wiu.z){ // fill in from up
		f.y -= du;
	}
	if(terrainHeight(uv) < wid.z){ // fill in from down
		f.y += dd;
	}
 
	f.z += dot(wir.xy , + vec2(1.0, 0.0));
	f.z += dot(wil.xy , - vec2(1.0, 0.0));
	f.z += dot(wiu.xy , + vec2(0.0, 1.0));
	f.z += dot(wid.xy , - vec2(0.0, 1.0));
 	
	f *= 0.25;
	f.xy = clamp(f.xy,-1.0,1.0);
	wi.xy = f.xy;
	wi.z += f.z;
}
 
void paint() {
    float dist = distance(gl_FragCoord.xy, mouse * resolution);
    if(dist <  paint_size){
    	wi.z += cos(dist / paint_size) * 0.5;
    	wi.z = clamp(wi.z, 0.0, 1.0);
    }	
}
 
void main( void ) {
	uv = gl_FragCoord.xy / resolution;
	uvp = vec2(1.0,1.0) / resolution;
	
	if(time < 0.5 || mod(time+1.0, 15.0 ) < 0.5) {
		clear();
	} else {
		wi = fluidInfo(uv);
		calcFloat();
		paint();
		
		draw();
	}
}
