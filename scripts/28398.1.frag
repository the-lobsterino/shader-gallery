#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

//oh, i see


//uncomment the defines for bonus features:
//noise is added to the time signal, scaled by mouse.y 
//useless extra ops are added to reduce the framerate, scaled by mouse.x


//#define NOISE
//#define REDUCE_FRAMERATE

// 1./454. will stop adding at 127./454.
// 1./453. adds without issues up to 1.
// (win10 nvidia 880m)
const float color_accuracy 	= 453.;
const float _color_accuracy 	= 1./color_accuracy;

float extract_bit(float n, float b);
float sprite(float n, vec2 p);
float digit(float n, vec2 p);
float print(float n, vec2 position);
vec3  calc_fps(float update_frequency, vec2 memory_uv);
float hash(float u);


vec4 sync_fps(float current_time, vec2 memory_uv)
{
	vec4 buffer 		= texture2D(renderbuffer, memory_uv);
	
	//'frame' - can only accurately measure down to intervals of the color
	buffer.x 		+= _color_accuracy;
	
	if(buffer.x >= 1.){
		buffer.x = _color_accuracy;
		// 'frame*frame'
		buffer.y += _color_accuracy;
	}
	
	// this 'sample control' is broken... should run at a fixed frequency (current_time < 0.01) and only once (buffer.x > 7.*_color_accuracy)
	// if color accuracy is higher than the max frame rate, then storage should be used for last-frame-fract-time instead, making this trigger easy
	// otherwise, multiple UVs chould be used for data store
	if(current_time < 0.01 && buffer.x > 7.*_color_accuracy){
		// 'fps'
		buffer.z = buffer.x;
		buffer.w = buffer.y;
		
		buffer.x = 0.;
		buffer.y = 0.;
	}
	
	return buffer;
}

void main( void ) 
{
	
	
	float current_time	= fract(time);
	
	
	#ifdef NOISE
	float noise		= pow((hash(fract(.001*time))-.5),mouse.y) * mouse.y;
	current_time 		= fract(noise+current_time);
	#endif
	
	
	vec2 memory_uv		= vec2(0.);
	
	vec4 fps		= sync_fps(current_time, memory_uv);
	if(floor(gl_FragCoord.xy) == floor(memory_uv))
	{
		gl_FragColor 	= fps;	
		return;
	}
	
	vec2 print_coord	= floor(gl_FragCoord.xy * 128./resolution) - vec2(18., 0.);
	float fps_out		= ((fps.w*color_accuracy)+fps.z)*color_accuracy*1.;
	float fps_print 	= print(fps_out, print_coord);
	
	
	
	
	float watts = 0.;
	#ifdef REDUCE_FRAMERATE
	watts = gl_FragCoord.x;
	for(float i = 0.; i < 1024.; i++)
	{
		watts += mod(i, mod(i, mod(i, mod(i, mod(i, mod(i, mod(i, mod(i, watts))))))));	
		if((mouse.x)*1024. < i) break;
	}
	watts = fract(watts)*.01;
	#endif
	
	vec2 uv 	= gl_FragCoord.xy/resolution;
	
	float column	= floor(uv.x * 9.);
	float row	= floor(uv.y * 8.);
	float col_print = 0.;
	vec4 buffer 	= texture2D(renderbuffer, memory_uv);
	vec4 plot	= vec4(0.);
	bool top	= uv.y > .25;
	if(top)
	{
		float sample_rate	= row < 7. ? 3. : .55;
		vec4 plot_buffer 	= texture2D(renderbuffer, uv - vec2(sample_rate/resolution.x, 0.));
		vec4 fps_buffer 	= texture2D(renderbuffer, uv - vec2(sample_rate/resolution.x, 0.));
		
		bool plot_pixel	 	= ceil(gl_FragCoord.x) == 1.;
		float y			= fract(uv.y*8.);
		plot_buffer		*= float(!plot_pixel);
		if(plot_pixel)
		{
			plot.yz 	+= row == 2. ? float(y < current_time) : 0.;
			plot.x 		+= row == 3. ? float(y < buffer.x) : 0.;
			plot.y 		+= row == 4. ? float(y < buffer.y) : 0.;
			plot.z 		+= row == 5. ? float(y < buffer.z) : 0.;
			plot.xy 	+= row == 6. ? float(y < buffer.w) : 0.;
			plot.xyz 	+= row == 7. ? float(y < fps_buffer.w) : 0.;
			plot.w		= fps_out/60.;
		}
		
		
		plot 		+= plot_buffer;
		plot 		*= float(mouse.x + mouse.y > .02);

		watts 		*= 0.;
	}
	else
	{
		
		plot.xw 	+= column == 2. ? buffer.x : 0.;
		plot.yw 	+= column == 4. ? buffer.y : 0.;
		plot.zw 	+= column == 6. ? buffer.z : 0.;
		plot.xyw 	+= column == 8. ? buffer.w : 0.;

		float y		= uv.y * 4.;
		plot.x		= step(y, plot.x);
		plot.y		= step(y, plot.y);
		plot.z		= step(y, plot.z);
		plot.xyz 	*= mod(floor(uv.x * 18.)-1., 2.); 
 		col_print	= print(plot.w * 256., mod(floor(gl_FragCoord.xy * 256./resolution), 256./9.) - vec2(32., 0.));
		plot 		+= column > 0. && mod(column, 2.) == 0. && uv.y < 1./9. ? col_print : 0.;
		plot.w 		*= 0.;
		plot 		+= fps_print + watts;
	}
	plot.w 		= fps_out/256.;
	
	gl_FragColor = plot;
}

float hash(float u)
{
    return fract(fract(u*9876.5432)*(u+u)*12345.678);
}


float extract_bit(float n, float b)
{
	n = floor(n);
	b = floor(b);
	b = floor(n/pow(2.,b));
	return float(mod(b,2.) == 1.);
}

float sprite(float n, vec2 p)
{
	p = floor(p);
	float bounds = float(all(lessThan(p, vec2(3., 5.))) && all(greaterThanEqual(p,vec2(0,0))));
	return extract_bit(n, (2. - p.x) + 3. * p.y) * bounds;
}

float digit(float n, vec2 p)
{
	n = mod(floor(n), 10.0);
	if(n == 0.) return sprite(31599., p);
	else if(n == 1.) return sprite( 9362., p);
	else if(n == 2.) return sprite(29671., p);
	else if(n == 3.) return sprite(29391., p);
	else if(n == 4.) return sprite(23497., p);
	else if(n == 5.) return sprite(31183., p);
	else if(n == 6.) return sprite(31215., p);
	else if(n == 7.) return sprite(29257., p);
	else if(n == 8.) return sprite(31727., p);
	else if(n == 9.) return sprite(31695., p);
	else return 0.0;
}

float print(float n, vec2 position)
{	
	float offset	= 4.;
	
	float result	= 0.;
	for(int i = 0; i < 8; i++)
	{
		float place	= pow(10., float(i));
		if(n > place || float(i) == 0.)
		{
			result	 	+= digit(n/place, position + vec2(8., 0.));
			position.x 	+= offset;
		}
		else
		{
			break;
		}
		
	}
	return result;
}
