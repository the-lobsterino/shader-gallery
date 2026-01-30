#ifdef GL_ES
precision mediump float;
#endif
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.141592653589793;
 
float sdSphere(vec3 p, float r) {
	return length(p) - r;
}

float udBox(vec3 p, vec3 b) {
	return length(max(abs(p) - b, 0.0));
}
 

float scene(vec3 p, out vec3 color) {
	int c = -1;
	float d;
	float di = 1.;

	d = sdSphere(p, 2.5);
	d = max(udBox(p, vec3(2.0)), -d);
	if(di > d) {di = d; c = 0;}
	d = min(sdSphere(p + vec3(sin(time) * 5.0, 0.0, 0.0), 1.2), d);
	if(di > d) {di = d; c = 1;}
	d = min(sdSphere(p + vec3(0.0, cos(time) * 5.0, 0.0), 1.2), d);
	if(di > d) {di = d; c = 2;}
	d = min(udBox(p + vec3(0.0, 0.0, 4.0), vec3(10.0, 10.0, 0.1)), d);
	if(di > d) {di = d; c = 3;}

	color = vec3(0.3, 0.5, 0.5);
	if (c == 0) color = vec3(1.0, 0.1, 0.1);
	if (c == 1) color = vec3(0.0, 1.0, 0.0);
	if (c == 2) color = vec3(0.0, 0.0, 1.0);
	if (c == 3) 
	{
		if (fract(p.x * .3) > .5)
	   		if (fract(p.y * .3) > .5)
				color = vec3(0, 1, 0.5);
   			else
     				color = vec3(0.8, 0.7, 0.0);
 		else 
			if (fract(p.y * .3) > .5)
     				color = vec3(0.8, 0.7, 0.0);
   			else
     				color = vec3(0, 1, 0.5);
	}
	return d;

}

vec3 calcNormal(vec3 p) {
	vec3 c;
	vec3 e = vec3(0.001, 0.0, 0.0);
	vec3 normal = normalize(vec3(
		scene(vec3(p.x + e.x, p.y, p.z), c) - scene(vec3(p.x - e.x, p.y, p.z), c),
		scene(vec3(p.x, p.y + e.x, p.z), c) - scene(vec3(p.x, p.y - e.x, p.z), c),
		scene(vec3(p.x, p.y, p.z + e.x), c) - scene(vec3(p.x, p.y, p.z - e.x), c)
	));
	return normal;
}

float shadow(vec3 ro, vec3 rd) {
	vec3 c;
	float t = 0.0;
	float d = 0.0;
	for(int i = 0; i < 60; i++) {
		d = scene(ro + rd * t, c);
		if(d < 0.01) {
			return 0.2;
		}
		t += d;
	}
	return 1.0;
}

bool trace(vec3 ro, vec3 rd, out vec3 p, out vec3 c) {
	float t = 0.0;
	float d = 0.0;
	for(int i = 0; i < 60; i++) {
		p = ro + rd * t;
		d = scene(p, c);
		t += d;
	}	
	return d < 1000.;	
}
 
mat3 axis_x_rotation_matrix(float angle) {
	return mat3(1.0, 0.0, 0.0,
		    0.0, cos(angle), -sin(angle),
		    0.0, sin(angle), cos(angle));
}
 
mat3 axis_y_rotation_matrix(float angle) {
	return mat3(cos(angle), 0.0, sin(angle),
		    0.0, 1.0, 0.0,
		    -sin(angle), 0.0, cos(angle));
}
 
void main( void ) {
 
	vec2 uv = gl_FragCoord.xy / resolution;
	vec3 ro = vec3(0.0, 0.0, 13.0);
	vec3 rd = normalize( vec3( (uv * 1.0 - 0.5) * vec2(resolution.x / resolution.y, 1.0), -1.0) );
	vec3 p = vec3(0.0);
	
	mat3 rotation = axis_y_rotation_matrix((1.0 - mouse.x * 2.0) * PI);
	rotation *= axis_x_rotation_matrix((mouse.y * 2.0 - 1.0) * PI);
	
	ro *= rotation;
	rd *= rotation;
	
	vec3 c;
	if (trace(ro, rd, p, c))
	 {
		vec3 nor = calcNormal(p);
		vec3 lightPos = vec3(40.0 * cos(time/2.1), 50.0 * sin(time/2.1), 40.0);
		vec3 lightDir = normalize(lightPos - p);
		float sh = shadow(p + lightDir * 0.05, lightDir);
		float ch = dot(nor, lightDir) * sh;
		c = (c * ch + 0.3*(pow(dot(nor, normalize(lightDir - rd)), 64.)));
	}
	gl_FragColor = vec4( c, 1.0 );
}
