// 040720 VIEWPOINT OF THE DRUNKEN SAILOR :)

//https://www.shadertoy.com/view/3t2yRD
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void )
{
    vec2 uv = (gl_FragCoord.xy-0.5*resolution.xy)/resolution.y;
    // uv.y += .5*sin(time)-.2,.5;
    float a = cos(time)*.1;
    // uv = uv*mat2(cos(a),-sin(a),sin(a),cos(a));
    
	uv = vec2(sin(time)*uv.x*uv.y + uv.x*0.8,  cos(time)*uv.x*uv.y + uv.y*0.8);
	// uv = vec2(sin(time)*uv.x*uv.x + uv.x*0.8,  cos(time)*uv.y*uv.y + uv.y*0.8);
	
    const float h = -.1; // horizon
    const float sc = 4.; // scale
    const float sp = .0; // speed
    
    float f = distance(uv,vec2(a,-0.08));
    float e = smoothstep(f,f+1.,.9)*step(h,uv.y);
    e += smoothstep(f,f+.01,.2);

    float d = 1./abs(uv.y*2.); //depth
    vec2 pv = vec2(uv.x*d, d); //perspective
    pv.x += a;
    pv.y += time*1./sc*sp; //offset
    pv *= sc; 
    pv = abs((fract(pv)-.5)*2.); //grid vector
    
    
    float c = smoothstep(length(pv),length(pv)+1./sc,.6)*smoothstep(uv.y,uv.y+1.2/sc,h);
    
    c *= abs(uv.y*2.);
    vec3 col = vec3(c,h*c,0.1);
    
    // col = mix(col,vec3(e,e/2.,1.-e)*step(h,uv.y),.5);
	col += vec3(e,e/4.,1.-e) * step(h,uv.y);
	
	
    	
	
    gl_FragColor = vec4(pow(col,vec3(1./2.2))*1.5,1.);
}