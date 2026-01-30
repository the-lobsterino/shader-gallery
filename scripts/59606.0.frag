#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

const float AMPLITUDE = .007;
const float FREQUENCY =1.73;

float dfSemiArc(float rma, float rmi, vec2 uv)
{
	return max(abs(length(uv) - rma) - rmi, uv.x-0.0);
}

float dfSemiArc2(float rma, float rmi, vec2 uv)
{
	return min(abs(length(uv) - rma) - rmi, uv.x+4.0);
}



float dfQuad(vec2 p0, vec2 p1, vec2 p2, vec2 p3, vec2 uv)
{
	vec2 s0n = normalize((p1 - p0).yx * vec2(-1,1));
	vec2 s1n = normalize((p2 - p1).yx * vec2(-1,1));
	vec2 s2n = normalize((p3 - p2).yx * vec2(-1,1));
	vec2 s3n = normalize((p0 - p3).yx * vec2(-1,1));
	
	return max(max(dot(uv-p0,s0n),dot(uv-p1,s1n)), max(dot(uv-p2,s2n),dot(uv-p3,s3n)));
}

float dfRect(vec2 size, vec2 uv)
{
	return max(max(-uv.x,uv.x - size.x),max(-uv.y,uv.y - size.t));
}

//--- Letters ---
void _G(inout float df, vec2 uv)
{
	
	df = min(df, dfSemiArc(0.5, 0.125, uv));
	df = min(df, dfQuad(vec2(0.000, 0.375), vec2(0.000, 0.625), vec2(0.250, 0.625), vec2(0.25, 0.375), uv));
	df = min(df, dfRect(vec2(0.250, 0.50), uv - vec2(0.0,-0.625)));
	df = min(df, dfQuad(vec2(-0.250,-0.125), vec2(-0.125,0.125), vec2(0.250,0.125), vec2(0.250,-0.125), uv));	
}

void _I(inout float df, vec2 uv)
{
	df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-0.280,-0.625)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-0.45,0.40)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-0.45,-0.625)));
}

//

void _A(inout float df, vec2 uv)
{
	df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-0.550,-0.625)));
    df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-0.1,-0.625)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-0.50,0.38)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-0.50,-0.20)));
   
}


void _T(inout float df, vec2 uv)
{
	df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-0.550,-0.625)));
    df = min(df, dfRect(vec2(0.700, 0.25), uv - vec2(-0.8,0.38)));
    
 
   
}

void _R(inout float df, vec2 uv)
{
	df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-1.0,-0.625)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-0.95,0.38)));
   df = min(df, dfRect(vec2(0.200, 0.60), uv - vec2(-0.600,-0.10)));
    df = min(df, dfRect(vec2(0.450, 0.25), uv - vec2(-0.95,-0.10)));
    
  //  df = min(df, dfRect(vec2(0.450, 0.25), uv - vec2(-0.80,-0.10)));

   df = min(df, dfQuad(vec2(-0.900,-0.100), vec2(-0.600,-0.100), vec2(-0.350,-0.625), vec2(-0.550,-0.625), uv));
   
   
}

void _O(inout float df, vec2 uv)
{
	df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-1.20,-0.625)));
    df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-0.750,-0.625)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-1.10,0.38)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-1.10,-0.625)));
   
}

void _N(inout float df, vec2 uv)
{
	df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-1.30,-0.625)));
    df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-0.650,-0.625)));
   df = min(df, dfQuad(vec2( -1.300,.625), vec2(-1.000,0.625), vec2(-0.450,-0.625), vec2(-0.650,-0.625), uv));
}



vec3 giga(vec2 uv)
{
	float tt=time;
     float bf=1.4;
	float dis = 1e6;
	float charSpace = 1.025;
	vec2 chuv = uv*18.0-vec2(4.8,0.9);
	chuv.x += charSpace * 3.0;
	

    _G(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.)))); chuv.x -= charSpace*0.9;
    
    _I(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*2.0)))); chuv.x -= charSpace*0.9;
    _G(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*3.0)))); chuv.x -= charSpace;
    _A(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*4.0)))); chuv.x -= charSpace*1.1;
    _T(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*5.0)))); chuv.x -= charSpace*1.1;
    _R(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*6.0)))); chuv.x -= charSpace;
    _O(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*7.0)))); chuv.x -= charSpace*0.95;
    _N(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*8.0)))); chuv.x -= charSpace;

   float mask = smoothstep(8.0/resolution.y,0.1,dis);
	mask = clamp(1.0-mask,0.0,1.0);
	vec3 col1 = vec3(0.6-sin(uv.x+time*0.6)*0.1,0.4+sin(time+uv.y)*0.25,0.2+sin(uv.x+uv.y+time*0.4)*0.4)*mask;	
	return col1;
}


void main() 
{
	vec2 position = (gl_FragCoord.xy / resolution.xy) - 0.4;
	float t = 0.1 * (time * 40.0);

	float waves = 0.0;
    	waves += sin(position.x * FREQUENCY);
    	 
    	waves += sin(position.x * FREQUENCY * 8.6522 + t * 1.259) * 5.5;
    	waves *= AMPLITUDE;
    
    	vec3 col;
    	if (position.y < waves) {
        	col = vec3(0.1, 0.01, 1.0);
    	} else {
        	col = vec3(0.3, 0.6-position.y, 0.9);
    	}
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	uv.x *= 1.1;
	col+=giga(uv-vec2(0.3,0.38+waves));

	gl_FragColor = vec4(col, 1.0 );

}