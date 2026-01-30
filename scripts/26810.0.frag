#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D last;

//Mouse over bottom left corner to reset.

#define BLUR_SIZE 5
#define NUM_CELLS 16

float tau = atan(1.0)*8.0;

struct Cell
{
	vec2 pos;
	float angle;
};
	
Cell cells[NUM_CELLS];
//-------------------------------------//
//--- Back buffer memory functions. ---//
//-------------------------------------//
const float floatScale = 100000.0;

void WriteNumber(vec2 pos, float val)
{
	if(floor(gl_FragCoord.xy) == pos)
	{
		gl_FragColor = (mod(floor(vec4(val * floatScale) / exp2(vec4(0,8,16,24))), vec4(256)) / 255.0);
	}
}
float ReadNumber(vec2 pos)
{
	return dot((texture2D(last, pos / resolution.xy) * 255.0) * exp2(vec4(0,8,16,24)),vec4(1)) / floatScale;
}

void WriteCell(vec2 pos, Cell value)
{
	WriteNumber(pos+vec2(0,0),value.pos.x);
	WriteNumber(pos+vec2(1,0),value.pos.y);
	WriteNumber(pos+vec2(2,0),mod(value.angle,tau));
}

Cell ReadCell(vec2 pos)
{
	return Cell(vec2(ReadNumber(pos+vec2(0,0)), ReadNumber(pos+vec2(1,0))), ReadNumber(pos+vec2(2,0)));
}
//-------------------------------------//
//-------------------------------------//
//-------------------------------------//

mat2 Rotate(float angle)
{
	return mat2(cos(angle), sin(angle), -sin(angle), cos(angle));   
}

float BlurAlpha(vec2 uv)
{
	vec2 aspect = resolution.xy/resolution.y;
	vec2 ps = 1.0 / resolution.xy;
	float sum = 0.0;
	float total = 0.0;

	for(int i = -BLUR_SIZE+1;i < BLUR_SIZE;i++)
	{
		for(int j = -BLUR_SIZE+1;j < BLUR_SIZE;j++)
		{
			sum += texture2D(last,uv/aspect + (ps * vec2(i,j))).a;
			total++;
		}
	}
	return sum / (total + 0.2);
}

vec2 Noise(vec2 p) 
{
	return vec2(fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 456367.5453),fract(sin(dot(p.xy ,vec2(-4.267,35.483))) * 316374.1672));
}

float DistLine(vec2 p0,vec2 p1,vec2 uv)
{
	vec2 dir = normalize(p1-p0);
	uv = (uv-p0) * mat2(dir.x,dir.y,-dir.y,dir.x);
	return distance(uv,clamp(uv,vec2(0),vec2(distance(p0,p1),0)));   
}

vec2 SampleAir(Cell cell)
{
	if(cell.pos.y < 0.05) return vec2(1); // liberation
	
	mat2 rotate = Rotate(cell.angle);
	vec2 a1pos = 0.03 * (vec2(1, 1) * rotate);
	vec2 a2pos = 0.03 * (vec2(1,-1) * rotate);
	
	vec2 aspect = resolution.xy/resolution.y;
	
	float a1 = texture2D(last,(cell.pos + a1pos)/aspect).a;
	float a2 = texture2D(last,(cell.pos + a2pos)/aspect).a;
	
	return vec2(a1, a2);
}

void main( void ) 
{
	vec2 aspect = resolution.xy/resolution.y;
	vec2 uv = ( gl_FragCoord.xy / resolution.y );
	vec2 muv = mouse*aspect;
	
	bool reset = length(mouse) < 0.01;
	
	float air = 1e6;
	float dist = 1e6;
	
	for(int i = 0;i < NUM_CELLS;i++)
	{
		if(time > 1.0 && !reset)
		{
			cells[i] = ReadCell(vec2(i * 3, 0));
			
			vec2 sample = SampleAir(cells[i]);
			
			cells[i].angle += cos(time/3.+float(i))*0.1*(sample.x - sample.y);
			
			vec2 dir = vec2(cos(cells[i].angle),sin(cells[i].angle));
			
			cells[i].pos += dir * ((sample.x+sample.y)/2.0) * max((0.02+0.021*sin(time/7.+float(i)*10.)),0.);
			
			cells[i].pos = mod(cells[i].pos,aspect);
			
			air = min(air, distance(cells[i].pos,uv));
			
			dist = min(dist, distance(cells[i].pos,uv));
			dist = min(dist, DistLine(cells[i].pos,cells[i].pos + dir * 0.03,uv) +0.005 );
		}
		else
		{
			vec2 pos = Noise(vec2(time,i)) * aspect;
			cells[i] = Cell(pos, Noise(vec2(0.2,i)).x * tau);
			dist = min(dist, length(cells[i].pos-uv));
		}
	}
	
	float color = smoothstep(0.010,0.008,dist);
	
	air = smoothstep(0.010,0.008,air) + BlurAlpha(uv);
	
	if(reset){air = 0.0;}
	
	//color = texture2D(last,uv/aspect).a;
	
	gl_FragColor = vec4( vec3( color*.8, air, air*1.6), air );
	
	for(int i = 0;i < NUM_CELLS;i++)
	{
		WriteCell(vec2(i * 3, 0),cells[i]);
	}
}