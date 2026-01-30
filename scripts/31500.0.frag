#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


/*
 A new mesy glsl code by kloumpt de la vega
 Must watch while listening to :
	https://www.youtube.com/watch?v=UBkSFFQ6ht0
*/
/* 
 Faked techniques from the book "Production Volumer Rendering" by Magnus Wrenninge
*/
	

#define STEP_MAX 64
#define RAYMARCH_LIGHT_STEPS 40

#define INSIDE_STEP_MAX 32
#define INSIDE_STEP_SIZE 0.01
float EPSILON = 0.0005;
#define EPSILON_LIGHT 0.0001

#define MAX_DIST 10.

//#define DEBUG
//#define time -2.5

vec3 light_pos=vec3(1.5*cos(time*.5), 1.5+cos(time)*.2, 1.5*sin(time*.5));
vec3 light_ambiant=vec3(.05, .5, .5);
vec3 light_diffuse=vec3(.8, .8, .5);
vec3 light_specular=vec3(1., 1., 1.);
float light_brightness=1.;
float LIGHT_LENGTH = 10.;

vec3 hsv2rgb(vec3 c);

float trace_light(vec3 p, vec3 ray_dir, float ray_min, float ray_max, float k);
float trace(vec3 p, vec3 ray_dir, float ray_min, float ray_max);
float sdBox(vec3 p, vec3 b);
float rand(vec3 n);
float rand(vec2 n);



vec2 rotate(vec2 p, float angle){
	return vec2(p.x*cos(angle)-p.y*sin(angle), p.y*cos(angle)+p.x*sin(angle));
}

float de_volumes(vec3 p){
	float d=length(p-vec3(0., 1.5+abs(cos(time))*.5, 0.))-.5;
	d = min(d, sdBox(p-vec3(0., 0.5, 0.), vec3(.5, .5, .5)));
	d = min(d, sdBox(p-vec3(1.75, 1.1, 1.75), vec3(.25, 1.1, .25)));
	d = min(d, sdBox(p-vec3(-1.75, 1.1, 1.75), vec3(.25, 1.1, .25)));
	d = min(d, sdBox(p-vec3(-1.75, 1.1, -1.75), vec3(.25, 1.1, .25)));
	d = min(d, sdBox(p-vec3(1.75, 1.1, -1.75), vec3(.25, 1.1, .25)));
	d = max(d, -sdBox(p-vec3(0., 1.5+abs(cos(time))*.5, 0.), vec3(3., .1, 3.)));
	return d ;
}

float round_union(float d1, float d2, float size){
	return min(min(d1, d2), length(vec2(d1, d2))-size);
}

float de_objects(vec3 p){
	float volume_d = de_volumes(p);
	return round_union(volume_d, sdBox(p-vec3(0., 0., 0.), vec3(2., 0.01, 2.)), .05);
}

float de_light(vec3 p){
	return length(p-light_pos)-.05;
}
float de_all(vec3 p){
	return min(de_light(p), de_objects(p));
}
vec3 compute_normal(vec3 p){
	vec2 off=vec2(0., EPSILON*.5);
  	vec3 n;
  	n.x = de_all(p+off.yxx);
  	n.y = de_all(p+off.xyx);
  	n.z = de_all(p+off.xxy);
	n = n-de_all(p);
  	return normalize(n);
}
float compute_ambiant_occlusion( vec3 p, vec3 normal){
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  normal * hr + p;
        float dd = de_objects( aopos );
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 2.*occ, 0.0, 1.0 );
}

int steps=0;

vec3 cheap_raymarch_in_object(vec3 p, vec3 dir){
	vec3 color=vec3(0., 0., 0.);
	float d=0., d_to_surface;
	
	for(int i=0; i<INSIDE_STEP_MAX; i++){
		d=de_volumes(p);
		
		
		steps++;
		if(d>-EPSILON){
			break;
		}
		d_to_surface=d;
		color+=vec3(0.1, 1., 1.)*.5*smoothstep(1., 0., d_to_surface);
		
		p+=INSIDE_STEP_SIZE*dir;
		
		
		
	}
	
	return color/float(INSIDE_STEP_MAX);
	
}

float trace_light(vec3 p, vec3 ray_dir, float ray_min, float ray_max, float k){
	float ray_len = ray_min;
	float res = 1.0;
	for(int i=0; i<RAYMARCH_LIGHT_STEPS; ++i) {
		float dist = de_objects(p);
		if (dist < EPSILON_LIGHT) break;
		if (ray_len > ray_max) return 1.0;
		p += dist*ray_dir;
		ray_len += dist;
		res = min(res, k * dist / ray_len);
	}
	return res;
}




float trace(vec3 p, vec3 ray_dir, float ray_min, float ray_max){
   float ray_len = ray_min;
   for(int i=0; i<STEP_MAX; ++i) {
   	  float dist = de_all(p);
      if (dist < EPSILON) break;
      if (ray_len > ray_max) return - ray_len;
      p += dist*ray_dir;
      ray_len += dist;
   }
   return ray_len;
}

vec3 texture(vec2 p, float hue){
	vec2 stripe_id = vec2( floor(p.x*10.), floor(p.y*1.) );
	p += vec2( (rand(stripe_id)-.5)*p.y, (rand(stripe_id)-.5)*p.x);
	stripe_id = vec2( floor(p.x*10.), floor(p.y*1.) );
	return hsv2rgb( vec3(hue + rand(stripe_id)*.1, .8- rand(stripe_id/10.)*.7, 1.));
}
vec3 texture(vec3 p, float hue){
	p.z+=.01;
	vec3 stripe_id = vec3( floor(p.x*10.), floor(p.y*1.), floor(p.z*10.));
	p += vec3( (rand(stripe_id)-.5)*p.y, (rand(stripe_id)-.5)*p.x, (rand(stripe_id)-.5)*p.y);
	stripe_id = vec3( floor(p.x*10.), floor(p.y*1.), floor(p.z*10.));
	return hsv2rgb( vec3(hue + rand(stripe_id)*.1, .8- rand(stripe_id/10.)*.7, .6));
}


vec3 compute_lightning(vec3 p, vec3 surface_color, vec3 normal, vec3 ray_dir, float specular_factor){
	vec3 If = vec3(0.);
	
	vec3 lightVec=normalize(light_pos-p);
	vec3 ray_to_light_dir=normalize(light_pos-p);
	
	float shadow = trace_light(p+normal*2.*EPSILON+ray_to_light_dir*EPSILON, ray_to_light_dir, EPSILON, distance(p, light_pos), 3.*LIGHT_LENGTH);
	float ao = compute_ambiant_occlusion(p, normal);
	//shadow *= clamp(1.-smoothstep(0., LIGHT_LENGTH, distance(p, light_pos)), 0., 1.);
	
	vec3 R = reflect(ray_to_light_dir, normal);
	float LambertTerm = max( dot(normal, ray_to_light_dir) , 0.0);
	
	vec3 Ia = light_ambiant * surface_color *light_brightness;
	
	If=Ia;
	if(LambertTerm > 0.0){
		vec3 Is = light_specular * surface_color * pow( max(dot(R, ray_dir), 0.0), specular_factor ) * light_brightness;
		vec3 Id = light_diffuse * surface_color * LambertTerm*light_brightness;
		If += (Id + Is) * shadow;
	}
	
	
	return If * ao ;
}

vec3 post_process(vec3 color){
	return pow(color, vec3(1.0 / 2.2));
}


vec3 camera_direction = vec3(0., 0., 1.);

vec3 ray_dir(){
	vec3 m_w = camera_direction;
	vec3  m_u = cross(vec3(0., -1., 0.), m_w);
	m_u = normalize(m_u);
	vec3 m_v = cross(m_w, m_u);

	
	float half_w = resolution.x * 0.5;
    float half_h = resolution.y * 0.5;

	float angle = tan( 3.1415/4. );

    float XX = resolution.x/resolution.y * angle * ( (gl_FragCoord.x - half_w ) / half_w );
    float YY = angle * ( (half_h - gl_FragCoord.y ) / half_h );

    return normalize( (m_u * XX + m_v * YY) - m_w );
}
	

void main( void ) {
	camera_direction = vec3(0., 0., -1.);
	camera_direction.xz = rotate(camera_direction.xz, time*.1);
	vec3 p = vec3(( gl_FragCoord.xy / resolution.xy -vec2(.5) )*2.*resolution.xx/resolution.yx, -3.5);
	p.y+=1.;
	vec3 color=vec3(0.5, 0.5*(.5+.5*p.y), 1.);
	vec3 normal=vec3(0.0);
	
	vec3 dir=ray_dir();
	p.xz = rotate(p.xz, time*.1);
	float dist=trace(p, dir, 0.0, MAX_DIST);//raymarch(p, dir, 0.1, MAX_DIST, 1./resolution.x);
	//EPSILON = dist*1./resolution.x;
	#ifdef DEBUG
	
	gl_FragColor = vec4(vec3(1., vec2(1.-smoothstep(0.0, 1., float(steps)/float(STEP_MAX)))), 1.);//*smoothstep(10., 0., dist);
	#else
	if(dist>=0.){
		p=p+dist*dir;
		normal=compute_normal(p);
		if(de_light(p)<EPSILON){
			color= light_diffuse;
		} else{ 
			float specular_factor = 0.0;
			if(de_volumes(p)<=EPSILON){
				specular_factor = 1.;
			} else {
				color = texture(p.xz, .5)/light_brightness;
				specular_factor= 20.0;
			}
			color = compute_lightning(p, color, normal, dir, specular_factor);
			
			if(de_volumes(p)<=EPSILON){
				color = compute_lightning(p, color, normal, dir, 2.0);
				
				vec3 color_ss = cheap_raymarch_in_object(p+INSIDE_STEP_SIZE*dir, dir);
				color = mix(color, color_ss, float(steps)/float(INSIDE_STEP_MAX)*.5);
			
			}
		}
	}
	color=clamp(color, vec3(0.), vec3(1.));			
	gl_FragColor = vec4( post_process(color), 1.0 );

	#endif

}




vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float rand(vec3 n){
    return fract(sin(n.x + n.y * 1e3 + n.z * 1e4) * 1e5);
}
float rand(vec2 n){
    return fract(sin(n.x + n.y * 1e3) * 1e5);
}
float sdBox( vec3 p, vec3 b ){
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}
