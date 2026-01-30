// fuck
/*
 * Original shader from: https://www.shadertoy.com/view/4sVczt
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
float iTime = 0.0;
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// Time simplification and easier overall speed control.
#define time iTime * 60.35
#define speed 0.9
#define scaleCo 0.25
#define rotation 1.4
#define angleOffset 0.1
#define intensity 2.1
#define outerOffset 0.9
#define polygonSides 8

#define PI 3.14159265359
#define TWOPI 6.28318530718


mat2 rot(float a){
    return mat2(
        sin(a),cos(a),
        cos(a),-sin(a)
        );
}

//from thebookofshaders.com
float polygon (vec2 st, float radius, int sides , float angle, float blur) {
    
      // Angle and radius from the current pixel
      float a = atan(st.x,st.y)+PI;
      float r = TWOPI/float(sides);

      // Shaping function that modulate the distance
      float d = cos(floor(1.5+a/r)*r-a)*length(st);
      return (1.0-smoothstep(radius, radius + blur ,d));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;	
	vec2 twistedUV =uv;
    
	vec3 bgCol = vec3(0.85,0.85,1.0);
	vec3 pixel = bgCol;
    
    float originalAngle = PI * rotation * sin(speed * iTime) + length(uv) * -cos(speed * (iTime - outerOffset)) * intensity;
    
    float i = 0.0;
    for(float j = 20.0; j > 0.0; j--)
    {    
        float scale = (j * scaleCo);
        float angle = originalAngle+  angleOffset * j;
        twistedUV =  vec2(1.0) * uv * rot(angle);
        
        if(polygon(twistedUV, 0.4 * scale, polygonSides, 0.0, 0.065) > 0.0 ||
           polygon(twistedUV, (0.4 - 0.02/scale) * scale, polygonSides, 0.0, 0.0022) > 0.0){
            i = j;
        }
    }  
    
    
    	float angle = originalAngle+  angleOffset * i;
        
        float scale = (i * scaleCo*0.9);
        vec3 changingColor = 0.5 + 0.5*cos(2.0*iTime+  (70.0-i) * 0.9 +vec3(0,2,4));     
	    twistedUV = uv;
           
        
        pixel = mix(pixel, (vec3(0.04 * i) + changingColor)/2.0 , polygon(twistedUV, 0.4 * scale, polygonSides, 0.0, 0.065));
		pixel = mix(pixel, (vec3(0.06 * (17.0-i)) + changingColor)/2.0 , polygon(twistedUV, (.7 - 0.02/scale) * scale, polygonSides, 0.0, 0.0022));
    
	fragColor =vec4(pixel, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

#undef time

void main(void)
{
    iTime = time;
    mainImage(gl_FragColor, gl_FragCoord.xy);
}