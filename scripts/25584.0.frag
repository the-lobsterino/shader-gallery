#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

//seeded hashing test

float hash(float v)
{
	return fract(fract(v*1234.5678)*(v+v)*12345.678); //only good for values between ~1.-8.
}

void main( void ) 
{
	//screen coordinates
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;

	
	//get last frame (for comparison) and lower left pixel (to seed the next frame)
	vec4 last_frame	= texture2D(renderbuffer, uv);
	vec4 seed_pixel	= texture2D(renderbuffer, vec2(0.));	


	//create hash
	float seed	= seed_pixel.w;
	float noise	= hash(seed+uv.x-uv.y);
	
	
	//round results
	float last	= floor(last_frame.w * 256.);
	float current	= floor(noise * 256.);
	
	
	//check if the prior value equals the current value, or the prior frame had a collision
	bool collision	= current == last || last_frame.x > 0.;
	
	
	//red 	= collision
	//green = new value
	vec3 color	= collision ? vec3(1,  0., 0.) : vec3(0., 1., 0.);
		
	
	//write out results
	vec4 result = vec4(0.);
	if(collision) 
	{
		//stop, the psudorandom series has ended - dead pixel =(
		result = vec4(1., 0., 0., last_frame.w);
	}
	else
	{
		//push the next frame
		result = vec4(color-noise, noise);
	}
	
	
	//reset if the mouse is in the bottom left corner
	bool reset	= mouse.x + mouse.y < .02;
	result 		= reset ? vec4(0., 0., 0., noise)  : result;
	
	gl_FragColor = result;	
}