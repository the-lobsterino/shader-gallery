// BIG CUNT II - dogShit style V

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

float lengthN(vec2 v, float n)
{
vec2 tmp = pow(abs(v), vec2(n));
return pow(tmp.x + tmp.y, 1.0 / n);	
}

float BigCuntII()
{
vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	p*=0.2;
p *= 1.2+sin(time*p.x)*0.25;
vec3 destColor = vec3(0.0);
float d = length(p);
float c = sin(lengthN(p, 4.0+(sin(time)*3.0)) * ((sin(time*0.4)*20.0)+44.0) - time * 3.0);
c += 1.5+sin(time+p.x*4.0+d+p.y*32.0)*2.3;
c *= 1.5+sin(time+p.x*32.0+d+p.y*24.0)*0.9;
c *= .5+sin(time+p.x*54.0+d+p.y*3.0)*0.9;
return c*1.1;
}


vec3 dogShit()
{
vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	p.x+=sin(time+p.x*3.0)*0.8;
p*=0.5;
	p.y+=sin(time*0.1+p.y*1.0)*0.2;
vec3 c = vec3(-0.3);
float amp = 0.5;
float glowT = sin(time) * 0.5 + 0.5;
float glowFactor = mix( 0.15, 0.35, glowT );
c += vec3(0.02, 0.03, 0.13) * ( glowFactor * abs( 1.0 / sin(p.x + sin( p.y + time ) * amp ) ));
c += vec3(0.02, 0.10, 0.03) * ( glowFactor * abs( 1.0 / sin(p.x + cos( p.y + time+1.00 ) * amp+0.1 ) ));
c += vec3(0.15, 0.05, 0.20) * ( glowFactor * abs( 1.0 / sin(p.y + sin( p.x + time+1.30 ) * amp+0.15 ) ));
c += vec3(0.20, 0.05, 0.05) * ( glowFactor * abs( 1.0 / sin(p.y + cos( p.x + time+3.00 ) * amp+0.3 ) ));
c += vec3(0.27, 0.17, 0.05) * ( glowFactor * abs( 1.0 / sin(p.y + cos( p.x + time+5.00 ) * amp+0.2 ) ));
return c*0.5+length(p);
}

void main( void )
{
	gl_FragColor = vec4(vec3(BigCuntII()),1.0);
	gl_FragColor += vec4(dogShit(),1.0);

}

