"""Add reservado to silos table

Revision ID: af7c37869734
Revises: c1651a784d60
Create Date: 2024-06-10 23:45:41.740453

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'af7c37869734'
down_revision: Union[str, None] = 'c1651a784d60'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('silos', sa.Column('reservado', sa.Integer(), nullable=False, server_default='0'))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('silos', 'reservado')
    # ### end Alembic commands ###
