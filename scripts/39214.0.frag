// gigatron fr;
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 

float fact = 10.;


vec3 hsv2rgb( in vec3 c )
{
	float r,g,b =1.0;
	
	float t = mod(0.+time/2.,16.0);
	float tt = mod(time,32.0);
	
	fact = floor(1.+tt  );
	
	r = floor(0.+t  );
	b = floor(6.+t*4.0  );
	g = floor(4.+t*2.0  );
      	
	
	vec3 rgb = clamp( abs(mod(c.x*fact+vec3(r,g,b),6.0)-3.0)-1.0, 0.0, 1.0 );
	
		
	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing	
	
	

	return c.z * mix( vec3(1.0), rgb, c.y);
}
void main( void ) {

    gl_FragColor = vec4( 0.,0.,0., 0.0 ); // ios fix 	
	
    vec2 uv = gl_FragCoord.xy / resolution.xy*2.-1.;
    vec2 uv2 = gl_FragCoord.xy / resolution.xy;
    float t = time;
    
    vec3 nr = normalize(vec3(uv,sin(t)*2.0)-cos(t)*3.); 
    
     uv.y  =uv.y*nr.z*(1.-nr.z*abs(cos(nr.z)));
   
      vec4 tx = vec4(uv.x,0.5,0.5,1.0);  
     
    
    if (sin(mod(length(uv-0.5),2.0)*floor(120.*nr.z))>0.8)
     
        gl_FragColor = vec4( hsv2rgb(vec3(tx.r, 1.0, 1.0)), 1.0 );
    
    else 
   
    gl_FragColor = vec4( 0.,0.,0., 1.0 );
}