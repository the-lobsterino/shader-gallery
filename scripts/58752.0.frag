// Original shader from: https://www.shadertoy.com/view/ltcfDj

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265;

float length2( vec2 p )
{
	return sqrt( p.x*p.x + p.y*p.y );
}

float length4( vec2 p )
{
	p = p*p; p = p*p;
	return pow( p.x + p.y, 1.0/4.0 );
}

float length8( vec2 p )
{
	p = p*p; p = p*p; p = p*p;
	return pow( p.x + p.y, 1.0/8.0 );
}

float sdCappedCylinder4( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length4(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length4(max(d,0.0));
}

float sdTorus82( vec3 p, vec2 t )
{
  vec2 q = vec2(length8(p.xz)-t.x,p.y);
  return length2(q)-t.y;
}

const float model_size_z = 1.3;

float map(in vec3 pos)
{
    float d = 1e10;

    for (int i = 0; i < 10; i++)
    {
        vec3 pos1 = pos;
        pos1.z += float(i) * 1.4 - 1.5;

        float d0 = sdTorus82(pos1, vec2(0.4,0.1) );
        float d1 = sdCappedCylinder4(pos1, vec2(0.4,0.2) );

        float r = (sin(time * 0.3 + (2.0 * PI) * float(i) / 10.0) + 1.0) * 0.5;
        float d2 = d0 * r + d1 * (1.0 - r);
        d = min(d, d2);
    }
   
    return d;
}

vec3 calcNormal( in vec3 pos )
{
    const float ep = 0.0001;
    vec2 e = vec2(1.0,-1.0)*0.5773;
    return normalize( e.xyy*map( pos + e.xyy*ep ) + 
					  e.yyx*map( pos + e.yyx*ep ) + 
					  e.yxy*map( pos + e.yxy*ep ) + 
					  e.xxx*map( pos + e.xxx*ep ) );
}

#define AA 3

void main(void)
{
    vec3 tot = vec3(0.0);
    
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        // pixel coordinates
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        vec2 p = (-resolution.xy + 2.0*(gl_FragCoord.xy+o))/resolution.y;

        vec3 ro = vec3(0.0,3.5,6.0);
        vec3 rd = normalize(vec3(p-vec2(0.0,1.0),-2.0));


        float t = 5.0;
        float t_max = 40.0;
        for( int i=0; i<80; i++ )
        {
            vec3 p = ro + t*rd;
            float h = map(p);
            if( abs(h)<0.001 || t>t_max ) break;
            t += h;
        }

        vec3 col = vec3(0.0);

        if( t<t_max )
        {
            vec3 pos = ro + t*rd;
            vec3 nor = calcNormal(pos);
            vec3  lig = normalize(vec3(1.0,0.8,-0.2));
            float dif = clamp(dot(nor,lig),0.0,1.0);
            float amb = .25 + 0.1*nor.x;
            col = vec3(0.05,0.7,0.15)*amb +  vec3(1.00,0.9,0.80)*dif;
        }

        col = sqrt( col );
        tot += col;
    }

    tot /= float(AA*AA);
	gl_FragColor = vec4( tot, 1.0 );
}