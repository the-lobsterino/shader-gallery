// CRT (Scanlines) effect test by Stv.

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define distortion 0.0

vec2 radialDistortion(vec2 coord) 
{
  vec2 cc    = coord - vec2(0.5);
  float dist = dot(cc, cc) * distortion;
	
  return coord + cc * (1.0 - dist) * dist;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;

	vec2 texCoord = vec2(position.xy);
	vec4 rgba = vec4(0);
	vec4 pix_rgb = vec4(0);
	
	
	
	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
			
	
	rgba += vec4(radialDistortion(vec2(color, color * 0.5)), sin( color + time / 3.0 ) * 0.75 , 1.0);	
		
	float pp = mod(gl_FragCoord.x * (0.5 * 4.0 / 3.0), 3.0);
	if (pp == 1.0) 
	{
	    pix_rgb.r = 1.0;
	    pix_rgb.g = 0.0;
	    pix_rgb.b = 0.0;
	}
	else if (pp == 2.0) 
	{
	    pix_rgb.r = 0.0;
	    pix_rgb.g = 1.0;
	    pix_rgb.b = 0.0;
	}
        else 
	{
	    pix_rgb.r = 0.0;
	    pix_rgb.g = 0.0;
	    pix_rgb.b = 1.0;
	}
	
	// rgba *= vec4(pix_rgb.r, pix_rgb.g, pix_rgb.b, 1.0);		
	rgba += smoothstep(0.2, 0.8, pix_rgb) + normalize(pix_rgb);
	
	vec4 intensity;
	
	if(fract(gl_FragCoord.y * (0.5 * 4.0 / 3.0)) < 0.5) 
	{
	    intensity += vec4(0);
	} 
	else 
	{
	    intensity += smoothstep(0.2, 0.8, rgba) + normalize(rgba);
	}
	
	if(fract(gl_FragCoord.x * (0.5 * 4.0 / 3.0)) < 0.5) 
	{
	    intensity += vec4(0);
	} 
	else 
	{
	    intensity += smoothstep(0.2, 0.8, rgba) + normalize(rgba);
	}
	 	
	
	gl_FragColor = intensity * -0.25 + rgba * 1.4;
	
	
	// gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}