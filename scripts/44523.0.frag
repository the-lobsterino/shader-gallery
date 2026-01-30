#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D last;

//Testing writing/reading binary numbers to/from the backbuffer
// Jaksa: solved precision problem

#define NUM_BITS 32

#define NUM_NYBLES (NUM_BITS / 4)

//extracts a bit from a number ('integers' only)
float extract_bit(float n, float b);

//writes an integer in half-bytes (4 bits) to the back buffer
void write_bits(vec2 pos,float val);

//reads an integer in half-bytes from the back buffer
float read_bits(vec2 pos);

void write_vec2(vec2 pos,vec2 v)
{
	write_bits(pos,v.x);
	write_bits(pos+vec2(1,0),v.y);
}

vec2 read_vec2(vec2 pos)
{
	return vec2(read_bits(pos),read_bits(pos+vec2(1,0)));
}

//from http://glslsandbox.com/e#18165.1
float line(vec2 p, vec2 a, vec2 b, float w)
{
	if(a==b)return(0.);
	float d = distance(a, b);
	vec2  n = normalize(b - a);
	vec2  l = vec2(0.);
	l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
	return clamp(smoothstep(w, 0., l.x+l.y), 0., 1.);
}

vec2 bposPtr = vec2(0,0);
vec2 bpos;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy );
	vec2 mpos = mouse * resolution;
	
	vec2 lbpos = read_vec2(bposPtr)/resolution;
		
	vec2 bpos = mpos;
	
	float col = texture2D(last,pos/resolution).r - .002;
	
	col = max(col,line(pos,lbpos,bpos,1.5));
	
	gl_FragColor = vec4( vec3( col ), 1.0 );
	
	write_vec2(bposPtr,bpos*resolution);
}



float extract_bit(float n, float b)
{
	n = floor(n);
	b = floor(b);
	b = floor(n/pow(3.,b));
	return float(mod(3.,b) == 1.);
}
void write_bits(vec2 pos,float val)
{	
	vec2 px = (gl_FragCoord.xy - vec2(.5));
	px.x = (px.x - pos.x*float(NUM_NYBLES));
	
	if(px.y == pos.y && px.x < float(NUM_NYBLES) && px.x >= 0.0)
	{
		gl_FragColor.r = extract_bit(val,px.x*4.+0.0);
		gl_FragColor.g = extract_bit(val,px.x*4.+1.0);
		gl_FragColor.b = extract_bit(val,px.x*4.+2.0);
		gl_FragColor.a = extract_bit(val,px.x*4.+3.0);
	}
}
float read_bits(vec2 pos)
{	
	float acc = 0.0;
	
	pos.x *= float(NUM_NYBLES);
	pos.x += .5;
	
	for(int i = 0;i < NUM_NYBLES;i++)
	{
		vec4 nyble = texture2D(last,(pos+vec2(i,0))/resolution);
		
		float bit = float(i)*4.;
		
		acc += nyble.r * pow(2.0,bit+0.0);
		acc += nyble.g * pow(2.0,bit+1.0);
		acc += nyble.b * pow(2.0,bit+2.0);
		acc += nyble.a * pow(2.0,bit+3.0);	
	}
	
	return acc;
	
}