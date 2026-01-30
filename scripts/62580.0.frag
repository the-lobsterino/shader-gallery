/*
 * Original shader from: https://www.shadertoy.com/view/MdSGWh
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
	//constants for ray marching
	const int max_iterations = 64;
	const float stop_threshold = 0.01;
	const float grad_step = 0.5;
	const float clip_far = 1000.0;

	//constants for ambient oclusion
	const int   ao_iterations = 5;
	const float ao_step = 1.0;
	const float ao_scale = 0.46;

	//math constants
	const float PI = 3.14159265359;
	const float DEG_TO_RAD = PI / 180.0;

	const vec3 upColor = vec3(237.0, 246.0, 255.0) / 255.0;
	const vec3 downColor = vec3(1.0);

	//rotation around X axis
	mat3 rotX(float angle) {
		angle *= DEG_TO_RAD;
		return mat3(1.0, 0.0, 0.0,
					0.0, cos(angle), -sin(angle),
					0.0, sin(angle), cos(angle));
	}
	
	//rotation around Y axis
	mat3 rotY(float angle) {
		angle *= DEG_TO_RAD;
		return mat3(cos(angle), 0.0, sin(angle),
					0.0, 1.0, 0.0,
					-sin(angle), 0.0, cos(angle));
	}

	//rotation around Z axis
	mat3 rotZ(float angle) {
		angle *= DEG_TO_RAD;
		return mat3(cos(angle), -sin(angle), 0.0,
					sin(angle), cos(angle), 0.0,
					0.0, 0.0, 1.0);
	}

	//Distance to box
	float dBox(vec3 p, vec3 b) {
		b *= 0.5;
		vec3 d = abs(p) - b;
		return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
	}

	//infinite Cilinder
	float dInfCil(vec3 p, float r) {
		return length(p.xz) - r;
	}

	//Cilinder (finite)
	float dCil(vec3 p, float r, float h) {
		return max( length(p.xz) - r, abs(p.y) - h * 0.5);
	}

	/*round sided box (can change the radius of the lower part).
	* ri... upper radius, rs... lower radius, h... height, w... width
	*/ 
	float rsBox(vec3 p, float rs, float ri, float h, float w, float side) {
		
		vec3 p1 = p.xyz;
		p1 *= rotX(90.0);
		p1 -= vec3(0.0, 0.0, h * 0.5);
		float upperCil = dCil(p1, rs, w);

		p1 -= vec3(side * (rs - ri), 0.0, -h);
		float lowerCil = dCil(p1, ri, w);

		float box = dBox(p, vec3(2.0 * rs, h, w));

		return min(min(upperCil, lowerCil), box);
	}

	//piston rod
	float biela(vec3 p) {

		p.y -= 171.2 * 0.5;
		
		float salida = dBox(p, vec3(50.0, 171.2, 18));

		float h = 110.0;
		float dy = 20.0;
		float rs = 22.5;
		float ri = 43.0;
		float dx = 17.7;

		float difSideRight = rsBox(p - vec3(rs + dx, dy, 0.0), rs, ri, h, 30.0, -1.);
		float difSideLeft = rsBox(p - vec3(- rs - dx, dy, 0.0), rs, ri, h, 30.0, 1.);
	
		salida = max(salida, -min(difSideLeft, difSideRight));

		float dz = 13.0;
		float difFront = rsBox(p -vec3(0.0, 6.0, -dz), 8.0, 8.0, 85.0, 20.0, 1.);
		float difBack = rsBox(p - vec3(0.0, 6.0, dz), 8.0, 8.0, 85.0, 20.0, 1.);

		salida =  max(salida, -min(difFront, difBack));

		vec3 p1 = p.xyz;
		p1 *= rotX(90.0);
		p1 -= vec3(0.0, 0.0, 85.6);
		float extCil = dCil(p1, 22.0, 38.0);
		float intCil = dInfCil(p1, 18.0);

		salida = max(min(salida, extCil), -intCil);

		p1 = p.xyz;
		p1 *= rotX(90.0);
		p1 *= rotZ(90.0);

		float infSection = rsBox(p1 - vec3(0.0, 0.0, -85.6), 9.0, 9.0, 72.0, 60.0, 1.);
		salida = min(salida, infSection);

		p1 = p.xyz;
		p1 *= rotX(90.0);
		p1 -= vec3(0.0, 0.0, -85.6);
		intCil = dInfCil(p1, 30.0);

		salida = max(min(salida, extCil), -intCil);

		float difBox = dBox(p - vec3(0.0, -85.6, 0.0), vec3(150.0, 1.0, 100.0));
		salida = max(salida, -difBox);

		return salida;
	}

	//piston
	float piston(vec3 p) {
		float salida;
		
		float cil = dCil(p, 43.0, 58.1);
		salida = cil;

		cil = dCil(p - vec3(0.0, 41.2, 0.0), 38.3, 24.3);
		salida = min(salida, cil);

		cil = dCil(p- vec3(0.0, 57.0, 0.0), 43.0, 7.3);
		salida = min(salida, cil);
		 
		for(int i = 0; i < 2; i++) {
			float dy = 36.25 + 10.0 * float(i);
			cil = dCil(p - vec3(0.0, dy, 0.0), 43.0, 5.7);
			salida = min(salida, cil);
		}

		cil = dInfCil(p * rotX(90.0) - vec3(0.0, 0.0, 4.0), 16.9);
		salida = max(salida, -cil);

		cil = dCil(p- vec3(0.0, -20.0, 0.0), 35.0, 100.0);
		salida = max(salida, -cil);

		cil = dCil(p * rotX(90.0) - vec3(0.0, 0.0, 4.0), 16.5, 86.0);
		salida = min(salida, cil);

		cil = dInfCil(p * rotX(90.0) - vec3(0.0, 0.0, 4.0), 13.0);
		salida = max(salida, -cil);

		cil = dInfCil(p * rotX(90.0) * rotZ(90.0) - vec3(0.0, 0.0, -70.0), 60.0);
		salida = max(salida, -cil);		

		return salida;
	}

	//crankshaft
	float ciguenal(vec3 p) {

		float salida = dCil(p - vec3(44.0, 0.0, 0.0), 32.0, 45.0);
		float shape = rsBox(p * rotZ(90.0) * rotY(90.0) -vec3(0.0, 20.0, 30.5), 40.0, 40.0, 40.0, 16.0, 1.);
		salida = min(salida, shape);

		shape = rsBox(p * rotZ(90.0) * rotY(90.0) -vec3(0.0, 20.0, -30.5), 40.0, 40.0, 40.0, 16.0, 1.);
		salida = min(salida, shape);

		shape = dCil(p - vec3(0.0, 57.5, 0.0), 32.0, 38.0);
		salida = min(salida, shape);

		shape = dCil(p - vec3(0.0, 73.5, 0.0), 16.0, 70.0);
		salida = min(salida, shape);

		shape = dCil(p - vec3(0.0, -57.5, 0.0), 32.0, 38.0);
		salida = min(salida, shape);

		float wheel = dCil(p - vec3(0.0, -84.0, 0.0), 72.0, 15.0);
		
		
		float hole;
		vec3 d;
		for(int i = 0; i < 8; i++) {
			d.x = 54.0 * cos(PI * float(i) * 0.25);
			d.z = 54.0 * sin(PI * float(i) * 0.25);
			hole = dInfCil(p - d, 7.0);
			wheel = max(wheel, -hole);
		}
		

		salida = min(salida, wheel);

		return salida;	
	}

	vec2 dist_field(vec3 p) {

		
		p.y -= 10.0;
		vec3 pp = p.xyz;
		pp.y += 200.0;

		p*= rotY(45.0);

		vec3 pC = p.xyz;
		p.y += 100.0;
		
		vec3 pB = p.xyz;
		float alfa = 300.0 * iTime * DEG_TO_RAD;
		float u = 44.0 * sin(alfa);
		float v = 44.0 * cos(alfa);
		pB.y += v;
		pB.x -= u;

		float beta = asin(u / (171.2)) * 180.0 / PI;
		pB *= rotZ(-beta);
			 		
		vec2 biela1 = vec2(biela(pB), 0.0);
		
		float h = 42.9 * (1.0 - cos(alfa) - 30.0 * sin(alfa) * sin(alfa) / 171.2);
		p.y -= h + 114.8;
		vec2 piston1 = vec2(piston(p), 1.0);
		
		pC.y += 100.0;
		pC *= rotX(90.0);
		pC *= rotY(300.0 * iTime - 90.0);
		
		vec2 ciguenal1 = vec2(ciguenal(pC), 2.0);
		
		vec2 salida = biela1;
		if(piston1.x < salida.x) salida = piston1;
		if(ciguenal1.x < salida.x) salida = ciguenal1;
		
		return salida;
		

	}

	// ao
	float ao( vec3 v, vec3 n ) {
		float sum = 0.0;
		float att = 1.0;
		float len = ao_step;
		for ( int i = 0; i < ao_iterations; i++ ) {
			sum += ( len - dist_field( v + n * len ).x ) * att;
			len += ao_step;
			att *= 0.5;
		}
		return max( 1.0 - sum * ao_scale, 0.0 );
	}


	// get gradient in the world
	vec3 gradient( vec3 v ) {
		const vec3 delta = vec3( grad_step, 0.0, 0.0 );
		return normalize (
			vec3(
				dist_field( v + delta.xyy).x - dist_field( v - delta.xyy).x,
				dist_field( v + delta.yxy).x - dist_field( v - delta.yxy).x,
				dist_field( v + delta.yyx).x - dist_field( v - delta.yyx).x			
			)
		);
	}

	// ray marching
	vec2 ray_marching( vec3 origin, vec3 dir, float start, float end ) {
		float depth = start;
		for ( int i = 0; i < max_iterations; i++ ) {
			vec2 dist = dist_field( origin + dir * depth );
			if ( dist.x < stop_threshold ) return vec2(depth, dist.y);
			depth += dist.x;
			if ( depth >= end) break;
		}
		return vec2(end);
	}

	// shadow
	float shadow( vec3 v, vec3 light ) {
		vec3 lv = v - light;
		float end = length( lv );
		lv /= end;
	
		float depth = ray_marching( light, lv, 0.0, end ).x;
	
		return step( end - depth, 0.02 );
	}

	// phong shading
	vec3 shading( vec3 v, vec3 n, vec3 eye ) {
	
		vec3 final = vec3( 0.0 );
	
		vec3 ev = normalize( v - eye );
		vec3 ref_ev = reflect( ev, n );
	
		// light 0
		{
			vec3 light_pos   = vec3(0.0, 500.0, -1000.0);
			vec3 vl = normalize( light_pos - v );
			float diffuse  = max( 0.0, dot( vl, n ) );
			float specular = max( 0.0, dot( vl, ref_ev ) );
			specular = pow( specular, 128.0 );
			final += vec3( 0.9 ) * ( diffuse * 0.4 + specular * 0.9 ) * shadow( v, light_pos ); 
		}
		
		final += ao( v, n ) * vec3( 0.15 );
	
		return final;
	}

	// get ray direction
	vec3 ray_dir( float fov, vec2 size, vec2 pos ) {
		vec2 xy = pos - size * 0.5;

		float cot_half_fov = tan( ( 90.0 - fov * 0.5 ) * DEG_TO_RAD );	
		float z = size.y * 0.5 * cot_half_fov;
	
		return normalize( vec3( xy, z ) );
	}

	void mainImage( out vec4 fragColor, in vec2 fragCoord )
	{
		// default ray dir
		vec3 dir = ray_dir( 45.0, iResolution.xy, fragCoord.xy );
		
		// default ray origin
		vec3 eye = vec3( 0.0, 0.0, -550.0 );
	
		// ray marching
		vec2 data = ray_marching( eye, dir, 0.0, clip_far );


		// shading
		vec3 pos = eye + dir * data.x;
		vec3 n = gradient( pos );
		vec3 lightColor =  shading( pos, n, eye ) * 2.0;
		vec3 color = vec3(0.);
		if(data.y == 0.0) color = vec3(0.5) * lightColor;
		if(data.y == 1.0) color = vec3(1.0) * lightColor;
		if(data.y == 2.0) color = vec3(1.0) * lightColor;
		
		// desat
		color = mix( color, vec3(dot(color,vec3(0.33))), 0.3);
		
    	// gamma
		color = pow( color, vec3(0.45) );

		fragColor = vec4(color, 1.0 );
	} 
	

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}