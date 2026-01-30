

uv *= rotate 
    
    float dd2 = length(uv);
    float dd1 = smoothstep(0.0,0.3,dd2);

    //if (abs(uv.x)>0.2)
        col2 *= 1.0-abs(uv.x*0.75);
        col1 *= 1.0-abs(uv.x*0.75);

    float dnoise = 15.0*(dd1);
    //uv *= rotate(-dnoise*0.05);
    
    float dns = 0.5+sin(iTime*.45)*0.5;
    dnoise = mix(dnoise,0.0,dns);
    
    float oo = 0.5+sin(dnoise+uv.y+uv.x*12.0+iTime*0.5)*0.5;
    uv = smoothRot(uv,6.0,0.085,16.0,.075*oo);
    vec2 d = uv*5.0;
    d.x += fract(iTime);
    float v1=length(0.5-fract(d.xy))+0.58;
    d = (uv*1.75);			// zoom
    float v2=length(0.5-fract(d.yy))-0.1525;		// border
    v1 *= 1.2-v2*v1;
    v1 = smoothstep(0.1,0.9,v1);
    vec3 col = mix(col2,col1,v1)*dd1;
    k = vec4(col*4.75,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}