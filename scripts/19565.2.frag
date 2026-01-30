#ifdef GL_ES
precision mediump float;
#endif

#define MAXITER 100

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat4 camera;

float pallo(vec3 paikka){
	float field = 0.;
	
	for(int i = 0; i < 10; i++){
		vec3 center = vec3(float(i)*sin(time/5.+float(i))*1.,0.,sin(time*.3)*float(i)*.1);
		
		center = (camera * vec4(center, 1.)).xyz;
		
		if (mod(float(i), 2.) == 0.){
			center.y += cos(time+float(i*i))*1.;
		}
		
		field += 1. / pow(length(center - paikka), 2.);
	}

	return sqrt(1./field) - .4;
}

void main( void ) {
	mat4 trans = mat4(1, 0, 0, 0,
			 0, 1, 0, 0,
			 0, 0, 1, 0,
			 0, 0, sin(time*.7)*20.+70., 1);
	mat4 a = mat4(cos(time), -sin(time), 0, 0,
		     sin(time), cos(time), 0, 0,
		     0, 0, 1, 0,
		     0, 0, 0, 1);
	mat4 b = 
		mat4(1, 0,0,0,
		     0, cos(.9), -sin(.9), 0,
		     0, sin(.9), cos(.9), 0,
		     0, 0, 0, 1);

	camera = trans * b *a;
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5 + mouse / 4.0;
	position.y *= resolution.y / resolution.x;

	int iter2 = MAXITER;
	
	vec3 paikka = vec3(0.);
	vec3 suunta = normalize(vec3(position, 5.));
	
	for(int iter = 0;iter < MAXITER; iter++){
		float dist = pallo(paikka);
		if (dist < 0.01){
			iter2 = iter;
			break;
		}
		paikka += suunta * dist;
	}
	
	if(iter2 == MAXITER){
		discard;
	}
	
	float d = 0.01;
	float dx = pallo(paikka + vec3(d, 0., 0.)) - pallo(paikka - vec3(d, 0., 0.));
	float dy = pallo(paikka + vec3(0., d, 0.)) - pallo(paikka - vec3(0., d, 0.));
	vec3 normal = cross(vec3(d * 2., 0., dx), vec3(0., d*2., dy));
	normal = normalize(normal);
	
	/*vec3 light = vec3(0., -100., -0.2);
	light = (camera * vec4(light, 1.)).xyz;
	
	light = paikka - light;
	light = normalize(light);
	
	
	float diffuse = dot(normal, light);
	
	float specular = pow(dot(reflect(-light, normal), vec3(0, 0, 1)), 5.);*/
	
	
	vec3 heijastus = reflect(paikka, normal);
	
	/*if (heijastus.y < 0.){
		discard;
	}*/
	
	vec3 kattopaikka = paikka + heijastus * (20. - paikka.y) / heijastus.y;
	
	if (mod(kattopaikka.x * .05, 2.) < 1. ^^ mod(kattopaikka.z * .05, 2.) < 1.){
		gl_FragColor = vec4(1.);
	}
	else{
		gl_FragColor = vec4(.5, .5, .5, 1.);	
	}
}