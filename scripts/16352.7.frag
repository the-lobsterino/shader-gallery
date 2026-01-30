#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
//uniform vec2 resolution;

varying vec2 surfacePosition;


#define pi    3.1415926535897932384626433832795 //pi
vec3 swr(vec3 p){
	vec3 col = vec3(sin(p));
	vec3 c = col;
	for(int i=1; i<6; i++)	{
		float ii = float(i);
		col.xyz=(sin((col.zxy+col.yzx)*ii))*(sin((col.zxy*col.yzx)*ii));
		c=cos(p*ii+col*3.14);
		col = mix(c*c,col,sin(p.z)*0.49+0.5);
	}
	return col;
}
vec4 spuke(vec4 pos, vec2 pos2)
{
	vec2 p   =((pos.z+pos2*pi)+(sin((((length(sin(pos2*(pos.xy)+time*pi)))+(cos((pos2-time*pi)/pi)))))*pos2))+pos.xy*pos.z; 
	vec3 col = vec3( 0.0, 0.0, 0.0 );
	float ca = 0.0;
	for( int j = 1; j < 5; j++ )
	{
		p *= 1.4;
		float jj = float( j );
		
		for( int i = 1; i <4; i++ )  
		{
			vec2 newp = p*0.96;
			float ii = float( i );
			newp.x += 1.2 / ( ii + jj ) * sin( ii * p.y + (p.x*.3) + cos(time/pi/pi)*pi*pi + 0.003 * ( jj / ii ) ) + 1.0;
			newp.y += 0.8 / ( ii + jj ) * cos( ii * p.x + (p.y*.3) + sin(time/pi/pi)*pi*pi + 0.003 * ( jj / ii ) ) - 1.0;
			p=newp;
			
		
		}
		p   *= 0.9;
		col += vec3( 0.5 * sin( pi * p.x ) + 0.5, 0.5 * sin( pi * p.y ) + 0.5, 0.5 * sin( pi * p.x ) * cos( pi * p.y ) + 0.5 )*(0.5*sin(pos.z*pi)+0.5);
		ca  += 0.7;
	}
	col /= ca;
	return vec4( swr(col * col * col), 1.0 );
}
void main( void ) {

	vec4 c = vec4(0.5);
	vec2 pos = surfacePosition*25.0;
	float ti = time * 0.1+length(pos);
	
	pos = ( vec2(pos.x*cos(time)-pos.y*sin(ti), pos.x*sin(ti)+pos.y*cos(ti)));
	float r = length(surfacePosition);
	float t = atan(pos.x, pos.y);
	
	for(int ph = 0; ph < 4; ph++){
		if(ph == 0){
			float v = 10.*cos(ti*.1);
			float f = (v-pow(cos(t),2.)/r)/(r*cos(t));
			c.x *= 1.+0.1*cos(f);
		}
		if(ph == 1){
			ti += 0.5;
			float v = 10.*cos(ti*.1);
			float f = (v-pow(cos(t),2.)/r)/(r*cos(t));
			c.y *= 1.+0.1*cos(f);
		}
		if(ph == 2){
			ti += 0.5;
			ti += 0.5;
			float v = 10.*cos(ti*.1);
			float f = (v-pow(cos(t),2.)/r)/(r*cos(t));
			c.z *= 1.+0.1*cos(f);
		}
		
	}
	
	if(r>0.){
		if(t>0.){
			gl_FragColor = c;
		}else{
			gl_FragColor = c*0.7;
		}
	}else{
		c = c*0.7;
		if(t>0.){
			gl_FragColor = c;
		}else{
			gl_FragColor = c*0.7;
		}
	}
	gl_FragColor = spuke(gl_FragColor,surfacePosition*pi*pi);
}