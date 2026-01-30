#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


//todo : fix bugs, work out best ratio, misc clean up

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;

vec2 cartesian(vec3 uvw)
{
	uvw.xy		-= uvw.z;
	uvw.xy		/= sqrt(3.);
	vec2 uv 	= vec2(uvw.y - uvw.x, uvw.y + uvw.x);		
	uv.y		*= sqrt(3.)/3.;
	return uv;
}


vec3 barycentric(vec2 uv)
{	
	uv.y		/= sqrt(3.);
	vec3 uvw	= vec3(uv.y - uv.x, uv.y + uv.x, -(uv.y + uv.y));
	uvw		*= sqrt(3.)/2.;
	return uvw;
}

bool winding(vec3 uvw)
{
	return mod(dot(floor(uvw), vec3(1.)), 2.) == 0.;
}


void main( void ) 
{
	float scale	= .125;	
	vec2 aspect 	= resolution/min(resolution.x,resolution.y);
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;	
	vec3 uvw 	= floor(barycentric(gl_FragCoord.xy*scale));
	bool wind	= winding(uvw);


	vec3 field	= uvw * 25./32.; // < mystery number
	field		= fract(field) * 1./6.;		


	
	vec3 mouse_uvw 	= floor(barycentric((vec2(.5)*resolution)*scale));

	
	float r3 	= sqrt(3.);
	vec2 rscale	= resolution*scale;
	vec2 f		= (cartesian(uvw - vec3(r3,0.,0.))/rscale);//top left
	vec2 b		= (cartesian(uvw - vec3(0.,r3,0.))/rscale);//top right
	vec2 d		= (cartesian(uvw - vec3(0.,0.,r3))/rscale);//down
	vec2 c		= (cartesian(uvw + vec3(r3,0.,0.))/rscale);//bottom right
	vec2 e		= (cartesian(uvw + vec3(0.,r3,0.))/rscale);//bottom left
	vec2 a		= (cartesian(uvw + vec3(0.,0.,r3))/rscale);//up
	
	vec4 neighbor[6];
	
	neighbor[0]	= texture2D(renderbuffer, a);
	neighbor[1]	= texture2D(renderbuffer, b);
	neighbor[2]	= texture2D(renderbuffer, c);
	neighbor[3]	= texture2D(renderbuffer, d);
	neighbor[4]	= texture2D(renderbuffer, e);
	neighbor[5]	= texture2D(renderbuffer, f);
	
	vec4 result	= vec4(0.); 
	for(float i = 0.; i < 6.; i++)
	{
		float angle 	= neighbor[int(i)].w;
		float axis 	= mod(angle * 6. + 5. , 6.);


		float sequence = 0.;
		sequence = axis < 2. 		   ? field.x : sequence;
		sequence = axis >= 2. && axis <= 4. ? field.y : sequence;
		sequence = axis > 4.		   ? field.z : sequence;
		
		result.w = floor(fract(angle + sequence)* 6.) == i ? angle : result.w;			
	}
	

	result		+= float(uvw==mouse_uvw) * fract(time/6.);	
	result.xyz	+= float(result.w>0.);
	result.xyz	+= texture2D(renderbuffer, cartesian(uvw)/rscale).xyz;	

	result 		*= float(mouse.x+mouse.y>.05);

	gl_FragColor 	= result;
}//sphinx