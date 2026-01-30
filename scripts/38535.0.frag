//  Modded By Dennis Hjorth // @dennishjorth on twitter. 

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ball(vec2 p, float fx, float fy, float ax, float ay, float offsetx, float offsety) {
    vec2 r = vec2(p.x + cos(3.1415*cos(time * fx * 0.25) + offsetx) * ax, p.y + sin(3.1415*sin(time * fy * 0.25) + offsety) * ay);	
    float color = (0.09)/length(r);
    color = color > 1.0 ? 1.0 : color;
    color = color*0.15;
    return color;
}

void main(void) {
    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = -1.0 + 2.0 * q;	
    p.x	*= resolution.x / resolution.y;

    float col1 = 0.0 ,col2 = 0.0, col3 = 0.0, col4 = 0.0, col5 = 0.0, col6 = 0.0;
    col1 += ball(p, 3.0*0.1, 2.0*0.1, 0.3, 0.6, 0.8, 0.7);
    col1 += ball(p, 8.5*0.1, 6.5*0.1, 0.7, 0.7, 0.4, 1.2);
    col1 += ball(p, 2.5*0.1, 3.5*0.1, 0.4, 0.5, 1.8, 1.4);

    col2 += ball(p, 8.0*0.1, 7.3*0.1, 0.9, 0.8, 0.4, 1.2);
    col2 += ball(p, 2.5*0.1, 3.5*0.1, 0.5, 0.5, 0.6, 0.3);	
    col2 += ball(p, 7.5*0.1, 3.5*0.1, 0.9, 0.9, 1.8, 1.4);

    col3 += ball(p, 3.0*0.1, 2.3*0.1, 0.4, 0.3, 0.4, 1.2);
    col3 += ball(p, 8.0*0.1, 7.0*0.1, 0.9, 0.8, 0.6, 0.3);
    col3 += ball(p, 2.5*0.1, 2.5*0.1, 0.7, 0.4, 1.8, 1.4);

    col4 += ball(p, 3.5*0.1, 2.1*0.1, 0.3, 0.6, 0.3, 0.4);
    col4 += ball(p, 3.0*0.1, 3.3*0.1, 0.6, 0.5, 0.6, 1.0);
    col4 += ball(p, 8.5*0.1, 7.5*0.1, 0.9, 0.8, 1.8, 1.8);
	
    col5 += ball(p, 3.5*0.1, 2.1*0.1, 0.3, 0.6, 0.3, 0.4);
    col5 += ball(p, 8.0*0.1, 7.3*0.1, 0.8, 0.8, 1.6, 1.2);
    col5 += ball(p, 3.5*0.1, 8.5*0.1, 0.2, 0.4, 0.8, 0.8);
    col6 += ball(p, 3.5*0.1, 2.1*0.1, 0.4, 0.5, 0.6, 0.2);
    float multiplier = 3.5;
    col1 *= multiplier;
    col2 *= multiplier;
    col3 *= multiplier;
    col4 *= multiplier;
    col5 *= multiplier;
    col6 *= multiplier;
	
    float spec = 2.25;
    col1 = pow(col1,spec);
    col2 = pow(col2,spec);
    col3 = pow(col3,spec);
    col4 = pow(col4,spec);
    col5 = pow(col5,spec);
    col6 = pow(col6,spec);
    col1 = col1 > 1.0 ? 1.0 : col1;
    col2 = col2 > 1.0 ? 1.0 : col2;
    col3 = col3 > 1.0 ? 1.0 : col3;
    col4 = col4 > 1.0 ? 1.0 : col4;
    col5 = col5 > 1.0 ? 1.0 : col5;
    col6 = col6 > 1.0 ? 1.0 : col6;

    float r,g,b,r1,g1,b1,r2,g2,b2,r3,g3,b3,r4,g4,b4,r5,g5,b5,r6,g6,b6;
	
    float heavy = 6.0;
    float light = 3.0;

    b1 = col1 * cos(col1) * light;
    g1 = col1 * cos(col1) * heavy; 
    r1 = col1 * cos(col1) * light;

    r2 = col2 * cos(col2) * light;
    g2 = col2 * cos(col2) * light;
    b2 = col2 * cos(col2) * heavy; 
	
    r3 = col3 * cos(col3) * heavy;
    g3 = col3 * cos(col3) * light;
    b3 = col3 * cos(col3) * light;
	
    r4 = col4 * cos(col4) * heavy;
    g4 = col4 * cos(col4) * heavy;
    b4 = col4 * cos(col4) * light;
	
    r5 = col5 * cos(col5) * heavy;
    g5 = col5 * cos(col5) * light;
    b5 = col5 * cos(col5) * heavy;
	
    r6 = col6 * cos(col6) * light;
    g6 = col6 * cos(col6) * light;
    b6 = col6 * cos(col6) * light;

    r = r1 + r2 + r3 + r4 + r5 + r6;
    g = g1 + g2 + g3 + g4 + g5 + g6;
    b = b1 + b2 + b3 + b4 + b5 + b6;

    gl_FragColor = vec4(r, g, b, 1.0);
}