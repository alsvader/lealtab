from iso2 import *
def qb(p0,c,p1,n=160):
    return [((1-t)**2*p0[0]+2*(1-t)*t*c[0]+t*t*p1[0],(1-t)**2*p0[1]+2*(1-t)*t*c[1]+t*t*p1[1]) for t in [i/n for i in range(n+1)]]
def blade(p0,p1,c_out,c_in):
    return Polygon(qb(p0,c_out,p1)+qb(p1,c_in,p0)[1:])
def golondrina():
    body=lens((56,10),(26,38),8.5)
    head=Point(50,15).buffer(6.2,resolution=128)
    w1=blade((47,17),(4,8),(30,-2),(28,14))        # wing up-left
    w1=w1.union(blade((40,26),(4,8),(26,6),(26,22)))
    w2=blade((47,20),(58,58),(64,30),(52,40))       # wing down-right
    w2=w2.union(blade((38,28),(58,58),(50,38),(42,44)))
    t1=blade((30,32),(4,48),(16,36),(14,42))
    t2=blade((32,36),(16,62),(24,46),(22,52))
    g=unary_union([body,head,w1,w2,t1,t2,Polygon([(26,30),(36,30),(34,42),(24,42)])])
    return center(rc(g,convex=0.4,concave=1.2))
if __name__=='__main__':
    FIN.append(('golondrina','g',golondrina))
