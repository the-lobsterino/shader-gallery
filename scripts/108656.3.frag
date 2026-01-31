#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float scanLine(float y, float d, float i)
{
    return (mod(y, 16.0 / d)*d) * i;
}


void main( void ) {
	
    vec2 uv = gl_FragCoord.xy / resolution.xy;
	
    //float sc = mod(gl_FragCoord.y,2.0);// + mod(gl_FragCoord.y,2.0);
	
    float sc= scanLine(gl_FragCoord.x, 5.0, 0.005)+scanLine(gl_FragCoord.y+time*3., 5.0, 0.005);

   
    uv *=  1.0 - uv.yx;   //vec2(1.0)- uv.yx; -> 1.-u.yx; Thanks FabriceNeyret !
    float vig = uv.x*uv.y * 15.0; // multiply with sth for intensity
    vig = pow(vig, 0.25); // change pow for modifying the extend of the  vignette
	
    	

	

    gl_FragColor = vec4(vig*0.8)+sc; 

}