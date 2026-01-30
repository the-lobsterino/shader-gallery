// more shat

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;


#define iTime time
#define iResolution resolution
vec4  iMouse = vec4(0.0);


void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    vec2 uv =  (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    for(float i = 1.0; i < 50.0; i+=5.0){
        uv.x += .9 / i * cos(i * .5* uv.y + iTime*0.68);
        uv.y += .9 / i * cos(i * 0.15 * uv.x + iTime);
    }
    
    vec3 col = vec3(0.1,0.15+sin(time)*0.05,0.2);
    
	//uv.x = dot(uv,uv);
	uv*=4.0+(sin(time*0.35)*2.7);
	
    fragColor = vec4(col/abs(sin(iTime-uv.y-uv.x)),1.0);
}

void main(void)
{
    iMouse = vec4(mouse * resolution, 0.0, 0.0);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
